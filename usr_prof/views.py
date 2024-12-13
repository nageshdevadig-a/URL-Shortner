import json
import os
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db import connection
from django.conf import settings
from django.core.files.storage import FileSystemStorage
# from django.contrib.auth import get_user_model
# from django.db.models import Q
# User = get_user_model()
# Create your views here.

def dictfetchone(cursor):
    row = cursor.fetchone()
    if row is None:
        return None
    return dict(zip([col[0] for col in cursor.description], row))

def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def displayProfilePage(request):
    if request.user.is_authenticated:
        try:
            # urls = UrlManager.objects.filter(userID=request.user.userId).order_by('-created')
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM home_urlmanager url JOIN home_userurlrelation rel ON url.urlID = rel.urlID_id WHERE userID_id = %s ORDER BY rel.created DESC;",[request.user.userId])
                urls = dictfetchall(cursor)
                if len(urls) >=5:
                    urls = urls[:5]
                    userName = request.user.name
                    userEmail = request.user.email
                    return render(request, 'profile.html',{'userName':userName,'userEmail':userEmail,'urls': urls,"is_logged_in": request.user.is_authenticated})
                else:
                    urls = urls[:len(urls)]
                    userName = request.user.name
                    userEmail = request.user.email
                    return render(request, 'profile.html', {'userName': userName, 'userEmail': userEmail, 'urls': urls,"is_logged_in": request.user.is_authenticated})

        except Exception as e:
            print(f"Error: {e}")
            return render(request, 'profile.html')
    else:
        return redirect('/')




def logoutUser(request):
    logout(request)
    return redirect("/")


def updateProfilePage(request):
    if request.user.is_authenticated:
        email = request.POST.get("email")
        name = request.POST.get("name")
        ''' updated_user = User.objects.get(userId = request.user.userId)
        updated_user.name = name
        updated_user.email = email
        updated_user.save() '''
        try:
            with connection.cursor() as cursor:
                cursor.execute('UPDATE home_customuser SET email = %s, name = %s WHERE userId = %s;',
                               [email, name, request.user.userId])
            return JsonResponse({"success": True, "message": "changes saved successfully"})
        except Exception as e:
            return JsonResponse({"success": False, "message": "cahnges not saved"})

    return JsonResponse({"success": False, "message": "403req"})


def deleteAccountPage(request):
    if request.user.is_authenticated:
        # User.objects.get(userId=request.user.userId).delete()
        with connection.cursor() as cursor:
            cursor.execute('DELETE FROM home_customuser WHERE userId = %s;',[request.user.userId])
        logout(request)
        return redirect("/")
    return redirect("/")


def updateUrlPage(request):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            longUrl = data.get("long-url")
            shortUrl = data.get("short-url")
            urlID = data.get("urlID")
            '''
            update_url = UrlManager.objects.get(urlID = urlID)
            if update_url.shortUrl != shortUrl:
                update_url.shortUrl = shortUrl
                update_url.visits = 0
            update_url.longUrl = longUrl
            update_url.save() '''
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM home_urlmanager WHERE urlID = %s;",[urlID])
                update_url = dictfetchone(cursor)
                if update_url["shortUrl"] != shortUrl:
                    cursor.execute("UPDATE home_urlmanager SET longUrl = %s, shortUrl = %s, visits = %s WHERE urlID = %s;",[longUrl, shortUrl,0, urlID])
                    return JsonResponse({"success": True, "message": "URL updated"})
                else:
                    cursor.execute("UPDATE home_urlmanager SET longUrl = %s WHERE urlID = %s;",[longUrl, urlID])
                    return JsonResponse({"success": True, "message": "URL updated"})

        else:
            return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)
    else:
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)




def deleteUrlPage(request):
    if request.method == 'DELETE':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            urlID = data.get("urlID")
            # UrlManager.objects.get(urlID = urlID).delete()
            with connection.cursor() as cursor:
                cursor.execute("DELETE FROM home_urlmanager WHERE urlID = %s;",[urlID])
                return JsonResponse({"success": True, "message": "URL updated"})
        else:
            return JsonResponse({"success": False, "message": "User not authenticated"}, status=401)
    else:
        return JsonResponse({"success": False, "message": "Invalid request method"}, status=405)



def searchQuery(request):
    if request.user.is_authenticated:
        query = request.GET.get("q",'').strip()
        urls = None
        with connection.cursor() as cursor:
            if query == "show-all":
                # urls = UrlManager.objects.filter(userID=request.user.userId)
                cursor.execute("SELECT * FROM home_urlmanager url JOIN home_userurlrelation rel ON url.urlID = rel.urlID_id WHERE userID_id = %s;",[request.user.userId])
                urls = dictfetchall(cursor)
            elif query == "recent-url":
                # urls = UrlManager.objects.filter(userID=request.user.userId).order_by('-created')
                cursor.execute("SELECT * FROM home_urlmanager url JOIN home_userurlrelation rel ON url.urlID = rel.urlID_id WHERE userID_id = %s ORDER BY rel.created DESC;",[request.user.userId])
                urls = dictfetchall(cursor)
            elif query == "top-ten-url":
                # urls = UrlManager.objects.filter(userID=request.user.userId).order_by('-visits')
                cursor.execute("SELECT * FROM home_urlmanager url JOIN home_userurlrelation rel ON url.urlID = rel.urlID_id WHERE userID_id = %s ORDER BY url.visits DESC;",[request.user.userId])
                urls = dictfetchall(cursor)
            else:
                # urls = UrlManager.objects.filter(Q(longUrl__icontains=query) | Q(shortUrl__icontains=query), userID=request.user.userId)
                queryString = f"%{query}%" # wrap the query inside %% for partial matching
                cursor.execute("SELECT * FROM home_urlmanager url JOIN home_userurlrelation rel ON url.urlID = rel.urlID_id WHERE (longUrl LIKE %s OR shortUrl LIKE %s) AND userID_id = %s ;",[queryString,queryString,request.user.userId])
                urls = dictfetchall(cursor)
        userName = request.user.name
        userEmail = request.user.email
        return render (request, "profile.html", {"urls": urls,'userName':userName,'userEmail':userEmail,"is_logged_in": request.user.is_authenticated})
    return redirect("/")


def upload_profile_photo(request):
    if request.method == 'POST' and request.FILES.get('profile_photo'):
        photo = request.FILES['profile_photo']
        user_id = request.user.userId
        profile_photos_path = os.path.join(settings.MEDIA_ROOT, 'profile_photos')
        # delete the img if it exist from same user
        for filename in os.listdir(profile_photos_path):
            if filename.startswith(f"{user_id}_"):
                # If a file exists, delete it
                os.remove(os.path.join(profile_photos_path, filename))
                break
        # Save file manually
        fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'profile_photos'))
        filename = fs.save(f"{user_id}_{photo.name}", photo)
        file_url = f"/media/profile_photos/{filename}"
        # Use raw SQL to update profile photo path
        with connection.cursor() as cursor:
            cursor.execute("UPDATE home_customuser SET profile_photo = %s WHERE userId = %s;",[file_url, request.user.userId])

        return JsonResponse({'success':True, 'message': 'Photo uploaded successfully', 'file_url': file_url})

    return JsonResponse({'error': 'No photo uploaded'}, status=400)


