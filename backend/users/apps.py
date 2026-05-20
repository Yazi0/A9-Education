from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        import sys
        # Execute migrations automatically when running the dev server
        if 'runserver' in sys.argv:
            from django.core.management import call_command
            try:
                call_command('makemigrations', 'users', interactive=False)
                call_command('migrate', interactive=False)
                print("--- Database Migrated Successfully (Auto) ---")

                # Auto-create or reset superuser credentials
                try:
                    from users.models import User
                    admin_user = User.objects.filter(username='admin').first()
                    if admin_user:
                        admin_user.set_password('adminpassword123')
                        admin_user.is_staff = True
                        admin_user.is_superuser = True
                        admin_user.save()
                        print("--- Admin password reset to: adminpassword123 ---")
                    else:
                        User.objects.create_superuser(
                            username='admin',
                            email='yasiru01nimsara@gmail.com',
                            password='adminpassword123',
                            name='Academy Admin',
                            is_staff=True,
                            is_superuser=True
                        )
                        print("--- Default Admin Created (username: admin, password: adminpassword123) ---")
                except Exception as user_err:
                    print("Auto superuser check failed:", user_err)

                # Auto-update existing teachers' credentials to follow the new format
                try:
                    import re
                    from users.models import User
                    teachers = User.objects.filter(role='teacher')
                    for i, teacher in enumerate(teachers):
                        seq_num = f"{i + 1:03d}"
                        
                        # 1. Clean short name
                        words = []
                        if teacher.name:
                            words = [w for w in teacher.name.split() if len(re.sub(r'[^a-zA-Z0-9]', '', w)) > 2]
                        if not words:
                            words = teacher.username.split()
                        raw_short = words[-1] if words else "teacher"
                        t_short = re.sub(r'[^a-zA-Z0-9]', '', raw_short).lower()
                        
                        # 2. Clean subject
                        subj_clean = re.sub(r'[^a-zA-Z0-9]', '', teacher.subject) if teacher.subject else "Maths"
                        
                        # 3. New Username and Password
                        new_username = f"{t_short}.{subj_clean}.{seq_num}"
                        new_password = f"{t_short}_{subj_clean}"
                        
                        if teacher.username != new_username:
                            print(f"Updating existing teacher credentials: {teacher.username} -> {new_username}")
                            teacher.username = new_username
                            teacher.set_password(new_password)
                            teacher.save()
                except Exception as t_err:
                    print("Auto teacher credentials migration failed:", t_err)

            except Exception as e:
                print("Auto-migration skipped or failed:", e)

