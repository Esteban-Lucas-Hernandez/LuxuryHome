"""
Este archivo define un comando de administración personalizado de Django (seed_furniture).
Su propósito es poblar la base de datos con datos iniciales (seed data) de muebles,
incluyendo categorías, nombres, descripciones, precios, y referencias a imágenes y
modelos 3D almacenados en el directorio estático. Facilita la configuración inicial del proyecto.
"""
from django.core.management.base import BaseCommand
from store.models import Category, Furniture


class Command(BaseCommand):
    help = "Carga los muebles iniciales en la base de datos usando los archivos de static/"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING("🪑 Iniciando carga de muebles..."))

        # ── Categorías ──────────────────────────────────────────────────────────
        # Busca o crea la categoría "Sillas". Esto previene duplicados si el script se corre múltiples veces.
        sillas_cat, created = Category.objects.get_or_create(name="Sillas")
        if created:
            self.stdout.write(self.style.SUCCESS(f"  ✔ Categoría creada: {sillas_cat.name}"))
        else:
            self.stdout.write(f"  · Categoría ya existe: {sillas_cat.name}")

        # ── Datos de muebles  ────────────────────────────────────────────────────
        # image_path  → nombre del archivo en static/furniture_images/
        # model_3d_path → nombre del archivo en static/furniture_models/
        furniture_data = [
            {
                "name": "Silla de Oficina",
                "category": sillas_cat,
                "description": (
                    "Silla ergonómica de oficina con soporte lumbar ajustable, "
                    "ruedas multidireccionales y reposabrazos acolchados. "
                    "Ideal para largas jornadas de trabajo."
                ),
                "price": "2499.00",
                "image_path": "silla.png",
                "model_3d_path": "chair.glb",
                "stock": 15,
                "is_3d_active": True,
                "scale_factor": 1.0,
            },
            {
                "name": "Silla Gaming GAMMIG",
                "category": sillas_cat,
                "description": (
                    "Silla gaming profesional estilo GAMMIG con diseño aerodinámico, "
                    "tapizado de cuero sintético, respaldo reclinable hasta 160°, "
                    "almohada cervical y soporte lumbar."
                ),
                "price": "4999.00",
                "image_path": "gammig.png",
                "model_3d_path": "gaming_chair.glb",
                "stock": 8,
                "is_3d_active": True,
                "scale_factor": 1.0,
            },
            {
                "name": "Silla de Madera",
                "category": sillas_cat,
                "description": (
                    "Silla de comedor artesanal fabricada en madera maciza de roble. "
                    "Acabado natural con barniz protector. Diseño clásico y resistente, "
                    "perfecta para comedor o sala de reuniones."
                ),
                "price": "1899.00",
                "image_path": "sillaMadera.png",
                "model_3d_path": "wooden_dining_chair.glb",
                "stock": 20,
                "is_3d_active": True,
                "scale_factor": 1.0,
            },
            {
                "name": "Silla Streamer Pro",
                "category": sillas_cat,
                "description": (
                    "Silla especialmente diseñada para streamers y creadores de contenido. "
                    "Base giratoria 360°, tela transpirable, altura ajustable y estructura "
                    "metálica reforzada para sesiones prolongadas frente a cámara."
                ),
                "price": "3799.00",
                "image_path": "sillaStreamer.png",
                "model_3d_path": "office_chair.glb",
                "stock": 12,
                "is_3d_active": True,
                "scale_factor": 1.0,
            },
        ]

        # ── Insertar / actualizar ────────────────────────────────────────────────
        # Se iteran los datos para crear los registros en la base de datos o actualizarlos si ya existen
        created_count = 0
        updated_count = 0

        for data in furniture_data:
            obj, created = Furniture.objects.update_or_create(
                name=data["name"],
                defaults={
                    "category": data["category"],
                    "description": data["description"],
                    "price": data["price"],
                    "image_path": data["image_path"],
                    "model_3d_path": data["model_3d_path"],
                    "stock": data["stock"],
                    "is_3d_active": data["is_3d_active"],
                    "scale_factor": data["scale_factor"],
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"  ✔ Creado:       {obj.name}"))
                created_count += 1
            else:
                self.stdout.write(self.style.WARNING(f"  ↻ Actualizado:  {obj.name}"))
                updated_count += 1

        # ── Resumen ──────────────────────────────────────────────────────────────
        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"✅ Listo. {created_count} mueble(s) creado(s), "
                f"{updated_count} actualizado(s)."
            )
        )
        self.stdout.write(
            "   Imágenes servidas desde: /static/furniture_images/<archivo>"
        )
        self.stdout.write(
            "   Modelos 3D servidos desde: /static/furniture_models/<archivo>"
        )
