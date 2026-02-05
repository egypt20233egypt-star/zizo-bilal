import subprocess
import os
import webbrowser
import time

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

print("=" * 50)
print("   🚀 Starting Zizo-Bilal Server...")
print("=" * 50)

# Change to the script directory
os.chdir(script_dir)

# Start the Node server
try:
    process = subprocess.Popen(
        ["node", "server.js"],
        cwd=script_dir,
        shell=True
    )
    
    # Wait a bit for server to start
    time.sleep(3)
    
    # Open browser automatically
    print("\n📊 Opening Admin Panel...")
    webbrowser.open("http://localhost:3000/admin")
    
    print("\n✅ Server is running!")
    print("📊 Admin: http://localhost:3000/admin")
    print("🌐 Website: http://localhost:3000/website")
    print("\n⚠️ Press Ctrl+C to stop the server")
    
    # Wait for the process
    process.wait()
    
except KeyboardInterrupt:
    print("\n\n🛑 Server stopped.")
except Exception as e:
    print(f"\n❌ Error: {e}")
    input("\nPress Enter to exit...")
