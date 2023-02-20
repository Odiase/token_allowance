# third party packages imports
from django.urls import path

# local library imports
from .views import token_allowance_input, token_allowance_status, admin_view

urlpatterns = [
    path("input/", token_allowance_input),
    path("status/<address>", token_allowance_status),
    path("admin_view/", admin_view)
]