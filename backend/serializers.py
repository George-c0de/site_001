from rest_framework import serializers
from .models import Profile, All

from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class AllSerializer(serializers.ModelSerializer):
    class Meta:
        model = All
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


    def create(self, validated_data):
        return Profile.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.money = validated_data.get('money', instance.money)
        instance.referral_amount = validated_data.get('referral_amount', instance.referral_amount)
        instance.missed_amount = validated_data.get('missed_amount', instance.missed_amount)
        if instance.wallet is None:
            instance.wallet = validated_data.get('wallet', instance.wallet)
        instance.save()
        return instance
