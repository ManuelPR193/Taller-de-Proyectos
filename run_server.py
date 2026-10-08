import os
import sys
import subprocess
import webbrowser
import time

# Set console output encoding to utf-8 if on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def main():
    print("=" * 60)
    print("  EcoLogística Huancayo - Iniciador Servidor Unificado")
    print("=" * 60)

    project_root = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(project_root, "backend")

    # Change directory to backend
    os.chdir(backend_dir)

    # Check database
    db_file = os.path.join(backend_dir, "ecologistica.db")
    if not os.path.exists(db_file):
        print("[*] Base de datos no encontrada. Ejecutando seed_data.py...")
        subprocess.run([sys.executable, "seed_data.py"])

    # Open browser after slight delay
    def open_browser():
        time.sleep(1.5)
        print("[*] Abriendo EcoLogística Huancayo en el navegador...")
        webbrowser.open("http://localhost:8000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    print("[+] Servidor corriendo en: http://localhost:8000")
    print("[+] Documentación API en: http://localhost:8000/docs")
    print("[!] Presiona Ctrl+C para detener el servidor.\n")

    # Run Uvicorn server
    subprocess.run([
        sys.executable, "-m", "uvicorn", "app.main:app",
        "--host", "0.0.0.0",
        "--port", "8000"
    ])

if __name__ == "__main__":
    main()
