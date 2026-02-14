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
    
    alert("VM started! Wait for desktop, then click Lock Mouse button.");
}

function lockMouse() {
    alert("Lock Mouse button clicked!");
    
    const canvas = document.querySelector('#screen_container canvas');
    alert("Canvas found: " + (canvas !== null));
    
    if (canvas) {
        canvas.requestPointerLock();
        alert("requestPointerLock called");
    }
}

function toggleFullscreen() {
    document.getElementById("screen_container").requestFullscreen();
}
