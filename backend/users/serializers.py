from rest_framework import serializers
from .models import User, Product, Announcement, Vendor, SalesOrder, SalesItem, Feedback
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "name", "email", "phone", "password", "role"]

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)


class ProductSerializer(serializers.ModelSerializer):
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "category", "price", "stock", "image_url", "discount_percentage", "discounted_price"]


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"


class VendorSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = "__all__"

    def get_product_count(self, obj):
        return obj.products.count()

class SalesItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesItem
        fields = ["product", "quantity", "price"]

class SalesOrderSerializer(serializers.ModelSerializer):
    items = SalesItemSerializer(many=True, read_only=True)
    staff_name = serializers.CharField(source='staff.name', read_only=True)

    class Meta:
        model = SalesOrder
        fields = "__all__"

class FeedbackSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.name', read_only=True)
    
    class Meta:
        model = Feedback
        fields = "__all__"
