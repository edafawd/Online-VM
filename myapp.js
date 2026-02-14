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
            buffer: isoFile,
            async: true
        },
        autostart: true,
        boot_order: 0x123
    });
}

function lockMouse() {
    const canvas = document.querySelector('#screen_container canvas');
    
    if (!canvas) {
        alert("VM not started yet!");
        return;
    }
    
    canvas.requestPointerLock().then(() => {
        alert("Mouse locked! Press ESC to unlock.");
    }).catch((error) => {
        alert("Pointer lock failed: " + error.message);
    });
}

function toggleFullscreen() {
    const container = document.getElementById("screen_container");
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
