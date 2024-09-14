from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("play/<str:difficulty>", views.play, name="play"),
    path("leaderboard/<str:difficulty>", views.leaderboard_view, name="leaderboard"),
    path('result/', views.result, name='result')
]
