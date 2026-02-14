let emulator;

function startVM() {
    const isoFile = document.getElementById('iso_input').files[0];
    if (!isoFile) {
        alert('Please select an ISO file first!');
        return;
    }
    
    if (emulator) {
        emulator.stop();
    }
    
    const screenContainer = document.getElementById("screen_container");
    
    emulator = new V86({
        wasm_path: "https://cdn.jsdelivr.net/npm/v86@latest/build/v86.wasm",
        screen_container: screenContainer,
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
        boot_order: 0x123,
        acpi: true
    });
    
    // Pointer lock on click
    const canvas = screenContainer.querySelector('canvas');
    canvas.addEventListener('click', function() {
        canvas.requestPointerLock();
    });
    
    // Listen for pointer lock
    document.addEventListener('pointerlockchange', function() {
        if (document.pointerLockElement === canvas) {
            console.log('Mouse locked!');
        } else {
            console.log('Mouse unlocked - press ESC to release, click to relock');
        }
    });
}

function lockMouse() {
    const canvas = document.querySelector('#screen_container canvas');
    if (canvas) {
        canvas.requestPointerLock();
    }
}

function toggleFullscreen() {
    const container = document.getElementById("screen_container");
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
