import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import JsonResponse
import geonamescache

from .models import User, Game

# Create your views here.

def index(request):
    return render(request, "showdown/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "showdown/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "showdown/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "showdown/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "showdown/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "showdown/register.html")


def result(request):
    if request.method == "POST":
        print("POST method received")

        result = request.POST.get("result", None)
        winner = request.POST.get("winner", None)
        difficulty = request.POST.get("difficulty", None)
        

        if request.user.is_authenticated:
            current_user = User.objects.get(username=request.user.username)
            newGame = Game(player=current_user, score=result, difficulty=difficulty)
            newGame.save()

        # Store the data in the session
        request.session['result'] = result
        request.session['difficulty'] = difficulty
        request.session['winner'] = winner

        return redirect('result')


    result = request.session.get('result')
    difficulty = request.session.get('difficulty')
    winner = request.session.get('winner') == 'true'
    
    return render(request, "showdown/result.html", {
        "result": result,
        "difficulty": difficulty,
        "winner": winner
    })


def play(request, difficulty):
    gc = geonamescache.GeonamesCache()
    cities = gc.get_cities()
    if(difficulty == "easy"):
        max_population = 10000000
    elif(difficulty == "medium"):
        max_population = 5000000
    else:
        max_population = 100000
        
    available_cities = {geonameid: data for geonameid, data in cities.items() if int(data['population']) > max_population}
    cities_population = {} # name : population
    for city in available_cities.items():
        cities_population[city[1]["name"]] = city[1]["population"]

    return render(request, "showdown/game_screen.html", {
        "cities_json": json.dumps(cities_population),
        "difficulty": difficulty
        })

def leaderboard_view(request, difficulty):
    games = Game.objects.filter(difficulty=difficulty, score__gt=0).order_by('-score')[0:10]
    return render(request, "showdown/leaderboard.html", {
        "games": games,
        "difficulty": difficulty
        })