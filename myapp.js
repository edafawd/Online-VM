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
        boot_order: 0x123,
        mouse_capture: true,  // Enable mouse capture
        disable_keyboard: false,
        disable_mouse: false
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
