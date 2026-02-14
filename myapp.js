let emulator;

// Start VM button
document.getElementById('start_btn').addEventListener('click', function() {
    const isoFile = document.getElementById('iso_input').files[0];
    if (!isoFile) {
        alert('Please select an ISO file first!');
        return;
    }
    
    if (emulator) {
        emulator.stop();
    }
    
    emulator = new V86({
        wasm_path: "https://cdn.jsdelivr.net/npm/v86@latest/build/v86.wasm",
        screen_container: document.getElementById("screen_container"),
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        bios: {
            url: "https://cdn.jsdelivr.net/npm/v86@latest/bios/seabios.bin"
        },
        vga_bios: {
            url: "https://cdn.jsdelivr.net/npm/v86@latest/bios/vgabios.bin"
        },
        cdrom: {
            buffer: isoFile
        },
        autostart: true,
        boot_order: 0x123
    });
    
    document.getElementById('status').textContent = 'VM starting... Wait for desktop to load';
});

// Lock Mouse button
document.getElementById('lock_btn').addEventListener('click', function() {
    const canvas = document.querySelector('#screen_container canvas');
    
    if (!canvas) {
        alert("VM not started yet!");
        return;
    }
    
    canvas.requestPointerLock();
    document.getElementById('status').textContent = 'Mouse locked! Press ESC to unlock';
});

// Fullscreen button
document.getElementById('fullscreen_btn').addEventListener('click', function() {
    const container = document.getElementById("screen_container");
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Monitor pointer lock status
document.addEventListener('pointerlockchange', function() {
    if (document.pointerLockElement) {
        document.getElementById('status').textContent = 'Mouse locked! Press ESC to unlock';
    } else {
        document.getElementById('status').textContent = 'Mouse unlocked - Click "Lock Mouse" to lock again';
    }
});
