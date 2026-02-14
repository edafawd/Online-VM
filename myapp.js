let emulator;
let isMouseCaptured = false;

const preinstalledOS = {
    kolibri: "https://builds.kolibrios.org/eng/data/data/kolibri.img",
    tinycore: "http://tinycorelinux.net/13.x/x86/release/TinyCore-13.1.iso",
    dsl: "http://distro.ibiblio.org/damnsmall/current/dsl-4.11.rc2.iso",
    freedos: "http://www.ibiblio.org/pub/micro/pc-stuff/freedos/files/distributions/1.2/official/FD12CD.iso",
    windows1: "https://copy.sh/v86/images/windows101.img"
};

function osSelectChanged() {
    const select = document.getElementById('os_select');
    const fileInput = document.getElementById('iso_input');
    
    if (select.value === 'custom') {
        fileInput.style.display = 'inline-block';
    } else {
        fileInput.style.display = 'none';
    }
}

function startVM() {
    const select = document.getElementById('os_select');
    const isoFile = document.getElementById('iso_input').files[0];
    
    let isoUrl;
    let useHDA = false;
    
    if (select.value === 'custom') {
        if (!isoFile) {
            alert('Please select an ISO file!');
            return;
        }
        isoUrl = URL.createObjectURL(isoFile);
    } else if (select.value === '') {
        alert('Please select an operating system!');
        return;
    } else {
        isoUrl = preinstalledOS[select.value];
        if (select.value === 'kolibri' || select.value === 'freedos' || select.value === 'windows1') {
            useHDA = true;
        }
    }
    
    showNotification("Loading OS... Please wait", 3000);
    
    const config = {
        screen_container: document.getElementById("screen_container"),
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        bios: {
            url: "https://cdn.jsdelivr.net/npm/v86@latest/bios/seabios.bin"
        },
        vga_bios: {
            url: "https://cdn.jsdelivr.net/npm/v86@latest/bios/vgabios.bin"
        },
        network_relay_url: "wss://relay.widgetry.org/",
        autostart: true,
        acpi: false
    };
    
    if (useHDA) {
        config.hda = { url: isoUrl };
        config.boot_order = 0x132;
    } else {
        config.cdrom = { url: isoUrl };
        config.boot_order = 0x123;
    }
    
    emulator = new V86(config);
    
    setTimeout(function() {
        setupMouseCapture();
    }, 2000);
}

function setupMouseCapture() {
    const container = document.getElementById("screen_container");
    const canvas = container.querySelector("canvas");
    
    if (!canvas) {
        console.log("Canvas not found!");
        return;
    }
    
    canvas.addEventListener("click", function() {
        canvas.requestPointerLock();
    });
    
    document.addEventListener('pointerlockchange', function() {
        if (document.pointerLockElement === canvas) {
            isMouseCaptured = true;
            showNotification("Mouse captured! Press ESC to release", 2000);
        } else {
            isMouseCaptured = false;
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isMouseCaptured) {
                document.exitPointerLock();
            }
        }
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

function showNotification(message, duration) {
    duration = duration || 3000;
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(function() {
        notification.style.display = "none";
    }, duration);
}
