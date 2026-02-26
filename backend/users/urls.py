from django.urls import path
from . import views
from .views import (
    register,
    staff_login,
    staff_dashboard,
    admin_login,
    get_products,
    add_product,
    delete_product,
    update_product,
    get_announcements,
    add_announcement,
    get_staff,
        list_vendors,
    create_vendor,
    vendor_products,
    add_vendor_product,
    create_purchase_order,
    update_staff_status,
    get_purchase_orders,
)

urlpatterns = [
    path("register/", register),
    path("login/", staff_login),

    path("staff/dashboard/", staff_dashboard),
    path("staff/profile/update/", views.update_profile),

    path("admin-login/", admin_login),

    path("products/", get_products),
    path("add-product/", add_product),
    path("delete-product/<int:id>/", delete_product),
    path("update-product/<int:id>/", update_product),

    path("announcements/", get_announcements),
    path("add-announcement/", add_announcement),
    path("delete-announcement/<int:id>/", views.delete_announcement),

    path("notifications/", views.get_notifications),
    path("notifications/create/", views.create_notification),

    path("staff/", get_staff),
    path("staff/public/", views.get_public_staff), # NEW
    path("staff/<int:id>/status/", update_staff_status),
    path("staff/<int:id>/delete/", views.delete_staff), # NEW
    
    path("server-ip/", views.get_server_ip), # NEW
    
    path("feedback/submit/", views.submit_feedback), # NEW 


    # ✅ VENDOR ROUTES
    path("vendors/", list_vendors),
    path("vendors/search/", views.search_vendor_by_product),
    path("vendors/create/", create_vendor),
    path("vendors/<int:vendor_id>/products/", vendor_products),
    path("vendors/<int:vendor_id>/products/add/", add_vendor_product),
    path("purchase-orders/", create_purchase_order),
    path("purchase-history/", get_purchase_orders),
    path("sales/orders/", views.create_sales_order),
    path("staff/orders/", views.get_my_sales_orders),
    path("staff/orders/<int:id>/status/", views.update_sales_order_status),
    path("staff/orders/<int:id>/invoice/", views.download_invoice), # NEW
    path("feedback/", views.get_dashboard_feedback), 
    path("contact-us/", views.send_contact_email), # Contact Form
    path("analytics/", views.get_analytics_data), # Dashboard Analytics
    path("analytics/sales-prediction/", views.sales_prediction), # Sales Prediction AI

]