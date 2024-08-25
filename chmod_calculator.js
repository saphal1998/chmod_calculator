/* 
 * ================================= UTILS ========================================
 */

const PermissionBit = Object.freeze({
        READ: 0,
        WRITE: 1,
        EXECUTE: 2
})

const DEFAULT_PERMISSIONS = Object.freeze({
        owner: {
                r: false,
                w: false,
                x: false
        },
        group: {
                r: false,
                w: false,
                x: false
        },
        everyone: {
                r: false,
                w: false,
                x: false
        }
})

/**
* @param {number} bit - restricted to [1,2,3]
* @param {string} data - this is a character representing numbers [0-7]
* @returns {boolean} - true or false depending on if the bit is set
*/
function getBitStatus(data, bit) {
        const mask = 1 << bit;
        return !!(+data & mask)
}

/**
* @typedef {Object} Permissions
* @property {boolean} r read status
* @property {boolean} w write status
* @property {boolean} x execute status
*/

/**
* @param {string} code - this is a character representing numbers [0-7]
* @returns {Permissions} returns the permission status
*/
function getReadWriteExecuteStatus(code) {
        return {
                r: getBitStatus(code, PermissionBit.READ),
                w: getBitStatus(code, PermissionBit.WRITE),
                x: getBitStatus(code, PermissionBit.EXECUTE),
        }
}

/* 
 * ================================= UTILS ========================================
 */

class PermissionContext {
        #permissionText
        constructor(permissionText = "") {
                this.#permissionText = permissionText
        }

        ownerPermission() { }
        groupPermission() { }
        everyonePermission() { }
}

/**
 * @type {HTMLInputElement}
 */
const input = document.getElementById("permissions_text")
/**
 * @type {HTMLParagraphElement}
 */
const errorText = document.getElementById("error_text")
input.addEventListener("input", validateChmodInput);



function populatePermissions(permissions) {
        for (const scope in permissions) {
                for (const action in permissions[scope]) {
                        const id_key = `${scope}_${action}`
                        const element = document.getElementById(id_key)
                        if (element) {
                                element.checked = permissions[scope][action]
                        }
                }
        }
}


function validPermissionNumber(text) {
        for (let i = 0; i < text.length; i++) {
                const ch = text[i];
                if (ch < '0' || ch > '7') {
                        return false;
                }
        }

        return true;
}

function setCheckboxes(value) {
        const checkboxes = document.querySelectorAll("input[type='checkbox']")
        for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].disabled = !value
        }
}

function validateChmodInput(event) {
        const text = event.target.value;

        if (text.length != 3) {
                errorText.textContent = "The input needs to be of the format [0-7][0-7][0-7]";
                setCheckboxes(false);
                input.textContent = text.substr(0, 3)
                errorText.style.display = 'flex'
                populatePermissions(DEFAULT_PERMISSIONS)
                return;
        }

        if (!validPermissionNumber(text)) {
                errorText.textContent = "The input needs to have valid digits in each place";
                setCheckboxes(false);
                input.textContent = text.substr(0, 3)
                errorText.style.display = 'flex'
                populatePermissions(DEFAULT_PERMISSIONS)
                return;
        }
        errorText.style.display = 'none'

        const owner_permissions = text[0]
        const group_permissions = text[1]
        const everyone_permissions = text[2]
        const owner = getReadWriteExecuteStatus(owner_permissions)
        const group = getReadWriteExecuteStatus(group_permissions)
        const everyone = getReadWriteExecuteStatus(everyone_permissions)
        const permissions = { owner, group, everyone }

        populatePermissions(permissions)
}
