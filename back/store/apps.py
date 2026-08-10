from django.apps import AppConfig
from django.db.models.signals import post_migrate


def auto_load_fixtures(sender, **kwargs):
    try:
        from store.models import Category
        from django.core.management import call_command

        if not Category.objects.exists():
            call_command('loaddata', 'initial_data.json')
    except Exception:
        pass


class StoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'store'

    def ready(self):
        post_migrate.connect(auto_load_fixtures, sender=self)

