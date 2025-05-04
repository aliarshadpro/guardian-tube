document.addEventListener('DOMContentLoaded', function() {
    const pinInput = document.getElementById('pinInput');
    const submitPin = document.getElementById('submitPin');
    const setPin = document.getElementById('setPin');
    const toggleLock = document.getElementById('toggleLock');
    const status = document.getElementById('status');

    // Initialize extension state
    chrome.storage.sync.get(['pin', 'isLocked'], function(data) {
        if (!data.pin) {
            status.textContent = 'Please set a PIN first';
            status.className = 'status error';
        } else {
            status.textContent = data.isLocked ? 'Lock is enabled' : 'Lock is disabled';
            status.className = 'status success';
        }
    });

    // Handle PIN submission
    submitPin.addEventListener('click', function() {
        const enteredPin = pinInput.value;
        chrome.storage.sync.get(['pin', 'isLocked'], function(data) {
            if (enteredPin === data.pin) {
                chrome.storage.sync.set({ isLocked: false }, function() {
                    status.textContent = 'Lock disabled successfully';
                    status.className = 'status success';
                    pinInput.value = '';
                });
            } else {
                status.textContent = 'Incorrect PIN';
                status.className = 'status error';
                pinInput.value = '';
            }
        });
    });

    // Set new PIN
    setPin.addEventListener('click', function() {
        const newPin = prompt('Enter new 4-digit PIN:');
        if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
            chrome.storage.sync.set({ pin: newPin, isLocked: true }, function() {
                status.textContent = 'PIN set successfully';
                status.className = 'status success';
            });
        } else {
            status.textContent = 'Invalid PIN. Must be 4 digits.';
            status.className = 'status error';
        }
    });

    // Toggle lock
    toggleLock.addEventListener('click', function() {
        chrome.storage.sync.get(['pin', 'isLocked'], function(data) {
            if (!data.pin) {
                status.textContent = 'Please set a PIN first';
                status.className = 'status error';
                return;
            }
            const newLockState = !data.isLocked;
            chrome.storage.sync.set({ isLocked: newLockState }, function() {
                status.textContent = newLockState ? 'Lock enabled' : 'Lock disabled';
                status.className = 'status success';
            });
        });
    });
}); 