from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.HomeView.as_view()),
    path('fetch-data/', views.FetchStockData.as_view()),
]