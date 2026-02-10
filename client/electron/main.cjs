const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Start FastAPI backend server
function startBackend() {
  console.log('Starting FastAPI backend...');
  
  // Path to your main.py file
  const backendPath = path.join(__dirname, '..', '..', 'main.py');
  
  // Start the backend using uv
  backendProcess = spawn('uv', ['run', backendPath], {
    cwd: path.join(__dirname, '..', '..'),
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) =>{
    console.log(`Backend process exited with code ${code}`);
  });
}

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '..', 'public', 'icon-512.png')
  });

  // In production, load the built React app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
  }

  // Open DevTools in development
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Start backend first
  startBackend();
  
  // Wait a bit for backend to start, then create window
  setTimeout(createWindow, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill backend when app closes
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure backend is killed
  if (backendProcess) {
    backendProcess.kill();
  }
});
