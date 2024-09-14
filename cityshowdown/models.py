from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

DIFFICULTIES = [("hard", "hard"), ("medium", "medium"), ("easy", "easy")]

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='cityshowdown_user_set',  # Custom related name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='cityshowdown_user_permissions_set',  # Custom related name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )
    

    def __str__(self):
        return self.username

class Game(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE ,related_name='player')
    score = models.PositiveIntegerField()
    difficulty = models.CharField(max_length=50, choices=DIFFICULTIES)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.player} - {self.score} - {self.difficulty}"