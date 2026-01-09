import subprocess
import os
import sys
import time
import signal

def main():
    print("🚀 Starting Railway Defect Detection System...")
    
    # Get paths
    base_dir = os.getcwd()
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    # Command for Backend (Python)
    # Using sys.executable ensures we use the same python interpreter
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--reload"]
    
    # Command for Frontend (npm)
    npm_exec = "npm.cmd" if os.name == "nt" else "npm"
    frontend_cmd = [npm_exec, "run", "dev"]

    processes = []
    
    try:
        print(f"📦 Starting Backend in {backend_dir}...")
        # shell=False is safer, but on Windows shell=True might be needed for PATH resolution of some tools if not absolute.
        # However, for sys.executable it's fine.
        backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)
        processes.append(backend_proc)

        print(f"🎨 Starting Frontend in {frontend_dir}...")
        frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)
        processes.append(frontend_proc)

        print("\n✅ System Running! Press Ctrl+C to stop.\n")
        
        # Monitor processes
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("❌ Backend process exited unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("❌ Frontend process exited unexpectedly.")
                break

    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
    finally:
        for p in processes:
            if p.poll() is None:
                p.terminate()
        print("Goodbye!")

if __name__ == "__main__":
    main()
