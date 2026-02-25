from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)

# =========================
# USER MANAGER
# =========================
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")

        return self.create_user(email, password, **extra_fields)


# =========================
# CUSTOM USER MODEL
# =========================
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("staff", "Staff"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="staff")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email


# =========================
# PRODUCT
# =========================
class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image_url = models.URLField(max_length=500, blank=True, default="")
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    @property
    def discounted_price(self):
        if self.discount_percentage > 0:
            discount_amount = (self.price * self.discount_percentage) / 100
            return self.price - discount_amount
        return self.price

    class Meta:
        db_table = "users_product"


# =========================
# ANNOUNCEMENT
# =========================
class Announcement(models.Model):
    title = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Vendor(models.Model):
    CATEGORY_CHOICES = [
        ("laptop", "Laptop"),
        ("phone", "Phone"),
        ("gadget", "Gadget"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class VendorProduct(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=100)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.vendor.name}"

class PurchaseOrder(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    invoice_no = models.CharField(max_length=50, unique=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    idempotency_key = models.UUIDField(unique=True, null=True, blank=True) # Prevent duplicates
class PurchaseItem(models.Model):
    order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(VendorProduct, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)


# =========================
# CUSTOMER SALES ORDER
# =========================
class SalesOrder(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    phone = models.CharField(max_length=15, default="")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # NEW
    final_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00) # NEW
    payment_method = models.CharField(max_length=50, default="Card")
    staff = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="sales_handled")
    staff_code = models.CharField(max_length=50, null=True, blank=True) # NEW
    STATUS_CHOICES = [
        ("processing", "Processing"),
        ("completed", "Completed"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="processing")
    created_at = models.DateTimeField(auto_now_add=True)
    confirmation_email_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

class SalesItem(models.Model):
    order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"

class Feedback(models.Model):
    order = models.OneToOneField(SalesOrder, on_delete=models.CASCADE, related_name="feedback")
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedbacks", null=True)
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Order #{self.order.id} ({self.rating} stars)"


class Notification(models.Model):
    message = models.TextField()
    type = models.CharField(max_length=50, default="alert") # alert, info, etc.
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type}: {self.message}"



