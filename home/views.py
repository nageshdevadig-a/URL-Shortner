from django.contrib.auth import login, authenticate, logout
from django.contrib.auth import get_user_model
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.db import connection
import json
from .models import UrlManager
User = get_user_model()

# function to zip tupes values into dict

def dictfetchone(cursor):
    row = cursor.fetchone()
    if row is None:
        return None
    return dict(zip([col[0] for col in cursor.description], row))

def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


# index page view
def index(request):
    return render(request, 'index.html',{"is_logged_in": request.user.is_authenticated})


'''
urlRedirect function checks for primary key(short url) in database..
if it present then it redirect the page to original url"..
if any error occurs during code execution such as error during database query if there is no
row present that satisfy the query then exception take control and excute the exception block,
it render the 404 page
 '''
def urlRedirect(request,shortUrl):
    try:
        # isPresent = UrlManager.objects.get(shortUrl=shortUrl)
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM home_urlmanager WHERE shortUrl = %s;", [shortUrl])
            isPresent = dictfetchone(cursor)
            incVisit = isPresent['visits']+1
            cursor.execute("UPDATE home_urlmanager SET visits = %s WHERE shortUrl = %s;", [incVisit,shortUrl])
            redirectUrl = isPresent['longUrl']
            return redirect(redirectUrl)
    except Exception as e:
        return render(request, '404.html', {"is_logged_in": request.user.is_authenticated})

'''
signIn view get the form data from user and csrfmiddlewaretoken
validation takes place. Then it proceed the request to this view function
it collect user data and query the database using in-built authenticate() function
and i will set the session cookie in user browser for further communication
'''
def signIn(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        #Authenticate the user use Django's authentication framework
        user = authenticate(email=email, password=password)
        if user is not None:
            login(request,user)
            return JsonResponse({"success": True, "message": "Login successful"})
        else:
            return JsonResponse({"success": False, "message": "invalid"})

    return JsonResponse({"success": False, "message": "403req"})


def signUp(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        name = request.POST.get("name")
        create_user = User.objects.create_user(name=name, email=email, password=password)
        if create_user is not None:
            login(request,create_user)
            return JsonResponse({"success": True, "message": "Sign up successful"})
        else:
            return JsonResponse({"success": False, "message": "sign up failed"})

    return JsonResponse({"success": False, "message": "403req"})


def checkAvailable(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            urlSuffix = data.get('urlSuffix')
            # querying database to check if shot url already exist in database
            try:
                # availableCheck = UrlManager.objects.get(shortUrl=urlSuffix)
                with connection.cursor() as cursor:
                    cursor.execute("SELECT * FROM home_urlmanager WHERE shortUrl = %s ;", [urlSuffix])
                    availableCheck = dictfetchone(cursor)
                    if availableCheck is not None:
                        return JsonResponse({"avalb": False, "urlSuffix": ""})
                    else:
                        return JsonResponse({"avalb": True, "urlSuffix": urlSuffix})
            except Exception as e:
                print(f"Exception in checkAvailability: {e}")

    return JsonResponse({"avalb": False, "urlSuffix": ""})



def createUrlRouting(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            data = json.loads(request.body)
            shortUrl = data.get('shortUrl')
            longUrl = data.get('longUrl')
            # urlRouting = UrlManager.objects.create(userID=request.user,shortUrl=shortUrl, longUrl=longUrl)
            try:
                with connection.cursor() as cursor:
                    cursor.execute("INSERT INTO home_urlmanager(longUrl, shortUrl) values(%s,%s);",[longUrl,shortUrl])
                    cursor.execute("INSERT INTO home_userurlrelation(userID_id, urlID_id) SELECT %s, LAST_INSERT_ID()", [request.user.userId])
                    cursor.execute("UPDATE home_urlmanager SET relationID_id = LAST_INSERT_ID() WHERE shortUrl = %s;",[shortUrl])
                    connection.commit()
                    return JsonResponse({"statusMsg":True, "shortUrl": shortUrl})
            except Exception as e:
                print(f"Exception in createUrlRouting: {e}")
                connection.rollback()
                return JsonResponse({"statusMsg":True, "shortUrl": shortUrl})


def changePasswordPage(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            current_password = request.POST.get('current_password')
            confirm_password = request.POST.get('confirm_password')
            user = authenticate(email=request.user.email, password=current_password)
            if user is not None:
                User.objects.update_password(confirm_password,request.user.email)
                logout(request)
                return JsonResponse({"success": True, "Msg":"Password changed successfully"})
            else:
                return JsonResponse({"success": False, "Msg": "Current password is incorrect"})
        elif request.method == 'GET':
            return render(request, 'change-passwd.html',{"is_logged_in": request.user.is_authenticated})
    return render(request, 'index.html',{"is_logged_in": request.user.is_authenticated})
