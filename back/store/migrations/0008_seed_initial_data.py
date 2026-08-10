# Generated manually for automatic database seeding

from django.db import migrations
from django.core.management import call_command


def load_initial_data(apps, schema_editor):
    Category = apps.get_model('store', 'Category')
    # Cargar fixtures si la base de datos no contiene categorías aún
    if not Category.objects.exists():
        call_command('loaddata', 'initial_data.json')


def reverse_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0007_category_parent'),
    ]

    operations = [
        migrations.RunPython(load_initial_data, reverse_code=reverse_func),
    ]
