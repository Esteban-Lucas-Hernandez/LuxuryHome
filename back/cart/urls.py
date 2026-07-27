from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_to_cart, name='add_to_cart'),
    path('remove/<int:item_id>/', views.remove_from_cart, name='remove_item'),
    path('update/<int:item_id>/', views.update_cart_item, name='update_item'),
    path('view/', views.cart_detail, name='cart_detail'),
]