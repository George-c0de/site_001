from django.contrib import admin
from django.urls import reverse
from .models import *
from django.utils.http import urlencode

from django.contrib.auth.models import User  # Group


class HistoryTransactionsProfileAdmin(admin.TabularInline):
    model = History_Transactions


@admin.register(Admin)
class ProfileAdminAdmin(admin.ModelAdmin):
    fields = ('user', 'money', 'wallet')


@admin.register(First_Line)
class FirstLineAdmin(admin.ModelAdmin):
    list_display = ('main_user', 'id_')
    fields = ('main_user',)

    def id_(self, obj):
        return obj.id

    id_.short_description = 'id_'


@admin.register(Second_Line)
class Second_LineAdmin(admin.ModelAdmin):
    list_display = ('main_user', 'id_')
    fields = ('main_user',)

    def id_(self, obj):
        return obj.id

    id_.short_description = 'id_'


@admin.register(Third_Line)
class Third_LineAdmin(admin.ModelAdmin):
    list_display = ('main_user', 'id_')
    fields = ('main_user',)

    def id_(self, obj):
        return obj.id

    id_.short_description = 'id_'


@admin.register(Category_Bronze)
class Category_Bronze_Admin(admin.ModelAdmin):
    list_display = (
        'card_6_disable', 'user',
    )
    search_fields = ('user__id',)
    list_filter = (
        'user', 'card_6_disable'
    )


@admin.register(Category_Silver)
class Category_Silver_Admin(admin.ModelAdmin):
    list_display = (
        'card_6_disable', 'user',
    )
    search_fields = ('user__id',)
    list_filter = (
        'user', 'card_6_disable'
    )


@admin.register(Category_Gold)
class Category_Gold_Admin(admin.ModelAdmin):
    list_display = (
        'card_6_disable', 'user',
    )
    search_fields = ('user__id',)
    list_filter = (
        'user', 'card_6_disable'
    )


@admin.register(Category_Emerald)
class Category_Emerald_Admin(admin.ModelAdmin):
    list_display = (
        'card_6_disable', 'user',
    )
    search_fields = ('user__id',)
    list_filter = (
        'user', 'card_6_disable'
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'user_id', 'money', 'referral_link', 'transactions', 'email',
        'referral_amount', 'missed_amount', 'max_card_', 'line_1_', 'line_2_',
        'line_3_'
    )

    def line_1_(self, obj):
        from django.utils.html import format_html
        if First_Line.objects.filter(main_user_id=obj.id).exists():
            a = First_Line.objects.get(main_user_id=obj.id)
            url = (
                    reverse("admin:backend_profile_changelist")
                    + "?"
                    + urlencode({"line_1": f"{a.id}"})
            )
            return format_html('<a href="{}">Линия 1</a>', url)
        else:
            a = 'Нет приглашенных рефералов'
            return a

    line_1_.short_description = 'Первая линия'

    def line_2_(self, obj):
        from django.utils.html import format_html
        if Second_Line.objects.filter(main_user_id=obj.id).exists():
            a = Second_Line.objects.get(main_user_id=obj.id)
            url = (
                    reverse("admin:backend_profile_changelist")
                    + "?"
                    + urlencode({"line_2": f"{a.id}"})
            )
            return format_html('<a href="{}">Линия 2</a>', url)
        else:
            a = 'Нет приглашенных рефералов'
            return a

    line_2_.short_description = 'Вторая линия'

    def line_3_(self, obj):
        from django.utils.html import format_html
        if Third_Line.objects.filter(main_user_id=obj.id).exists():
            a = Third_Line.objects.get(main_user_id=obj.id)
            url = (
                    reverse("admin:backend_profile_changelist")
                    + "?"
                    + urlencode({"line_3": f"{a.id}"})
            )
            return format_html('<a href="{}">Линия 3</a>', url)
        else:
            a = 'Нет приглашенных рефералов'
            return a

    line_3_.short_description = 'Третья линия'

    def max_card_(self, obj):
        if obj.max_card == ' ' or obj.max_card is None:
            return 'Пользователь не купил ни одной карты'
        else:
            return obj.max_card

    max_card_.short_description = 'Максимальная купленная карта(Формат при bronze 6 карта: 06)'

    def email(self, obj):
        from django.utils.html import format_html
        url = '/admin/auth/user/{}/change/'.format(obj.user.id)
        user = User.objects.get(id=obj.user.id).email
        if user == '' or user is None:
            user = 'Добавить email'
        return format_html('<a href="{}"> {}</a>', url, user)

    email.short_description = 'Изменить email'

    def transactions(self, obj):
        from django.utils.html import format_html
        url = (
                reverse("admin:backend_history_transactions_changelist")
                + "?"
                + urlencode({"user": f"{obj.id}"})
        )
        user_count = History_Transactions.objects.filter(user__id=obj.id).count()
        return format_html('<a href="{}"> Операций ({})</a>', url, user_count)

    def name(self, obj):
        a = Profile.objects.get(id=obj.id)
        return a.user.username

    def user_id(self, obj):
        id_user = obj.id
        return id_user

    name.short_description = 'Операции'
    name.short_description = 'Имя'
    user_id.short_description = 'id пользователя'
    search_fields = ('id',)


@admin.register(History_Transactions)
class HistoryTransactionsAdmin(admin.ModelAdmin):
    list_display = ('name_operation', 'success', 'quantity', 'data_view')

    def data_view(self, obj):
        date = obj.data
        date = date.strftime("%m.%d.%Y %H:%M:%S")
        return date

    data_view.short_description = 'data_view'
    list_filter = (
        'user', 'data', 'success'
    )
