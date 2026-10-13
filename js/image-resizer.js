
var resizerFile = document.getElementById("resizerFile");
var chooseResizerImageBtn = document.getElementById("chooseResizerImageBtn");
var resizerUploadArea = document.getElementById("resizerUploadArea");

var resizerOriginalPreview = document.getElementById("resizerOriginalPreview");
var resizerResultPreview = document.getElementById("resizerResultPreview");

var resizerOriginalPreviewBox = document.getElementById("resizerOriginalPreviewBox");
var resizerResultPreviewBox = document.getElementById("resizerResultPreviewBox");

var resizerWidth = document.getElementById("resizerWidth");
var resizerHeight = document.getElementById("resizerHeight");

var maintainAspectRatio = document.getElementById("maintainAspectRatio");
var resizerFormat = document.getElementById("resizerFormat");

var resizerQuality = document.getElementById("resizerQuality");
var resizerQualityValue = document.getElementById("resizerQualityValue");

var resizeImageBtn = document.getElementById("resizeImageBtn");

var downloadResizedBtn = document.getElementById("downloadResizedBtn");
var resetResizerBtn = document.getElementById("resetResizerBtn");

var resizerMessage = document.getElementById("resizerMessage");

var resizerOriginalFileName = document.getElementById("resizerOriginalFileName");
var resizerOriginalDimensions = document.getElementById("resizerOriginalDimensions");
var resizerOriginalFileSize = document.getElementById("resizerOriginalFileSize");

var resizerResultDimensions = document.getElementById("resizerResultDimensions");
var resizerResultFileSize = document.getElementById("resizerResultFileSize");

var resizerOriginalSizeStat = document.getElementById("resizerOriginalSizeStat");
var resizerResultSizeStat = document.getElementById("resizerResultSizeStat");
var resizerSpaceSavedStat = document.getElementById("resizerSpaceSavedStat");

// Store image information

var originalImage = null;
var originalImageFile = null;
var originalImageURL = null;
var resizedImageURL = null;

var originalWidth = 0;
var originalHeight = 0;

var resizedBlob = null;

// ================================
// FORMAT FILE SIZE
// ================================

function formatResizerFileSize(bytes) {

if (bytes < 1024) {
    return bytes + " B";
}

if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
}

return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

// ================================
// SHOW MESSAGE
// ================================

function showResizerMessage(message, type) {

resizerMessage.textContent = message;
resizerMessage.className = "resizer-message " + type;

}

// ================================
// CLEAR MESSAGE
// ================================

function clearResizerMessage() {

resizerMessage.textContent = "";
resizerMessage.className = "resizer-message";

}

// ================================
// OPEN FILE SELECTOR
// ================================

chooseResizerImageBtn.addEventListener("click", function() {

resizerFile.click();

});

// ================================
// UPLOAD IMAGE
// ================================

resizerFile.addEventListener("change", function() {

if (resizerFile.files.length > 0) {

    loadResizerImage(resizerFile.files[0]);

}

});

// ================================
// LOAD IMAGE
// ================================

function loadResizerImage(file) {

clearResizerMessage();

if (!file) {
    return;
}

var allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

if (allowedTypes.indexOf(file.type) === -1) {

    showResizerMessage(
        "Please choose a JPG, PNG, or WebP image.",
        "error"
    );

    return;
}

if (file.size > 15 * 1024 * 1024) {

    showResizerMessage(
        "Your image is larger than 15MB. Please choose a smaller image.",
        "error"
    );

    return;
}

var temporaryURL = URL.createObjectURL(file);

var image = new Image();

image.onload = function() {

    // Release the previous original image URL

    if (originalImageURL) {
        URL.revokeObjectURL(originalImageURL);
    }

    // Release the previous resized image URL

    if (resizedImageURL) {
        URL.revokeObjectURL(resizedImageURL);
        resizedImageURL = null;
    }

    originalImageFile = file;
    originalImageURL = temporaryURL;

    originalImage = image;

    originalWidth = image.naturalWidth;
    originalHeight = image.naturalHeight;

    // Show original image

    resizerOriginalPreview.src = originalImageURL;
    resizerOriginalPreview.hidden = false;

    var originalEmpty = resizerOriginalPreviewBox.querySelector(
        ".resizer-empty-preview"
    );

    if (originalEmpty) {
        originalEmpty.style.display = "none";
    }

    // Clear previous result

    resizerResultPreview.removeAttribute("src");
    resizerResultPreview.hidden = true;

    var resultEmpty = resizerResultPreviewBox.querySelector(
        ".resizer-empty-preview"
    );

    if (resultEmpty) {
        resultEmpty.style.display = "block";
    }

    // Show original image information

    resizerOriginalFileName.textContent = file.name;

    resizerOriginalDimensions.textContent =
        originalWidth + " × " + originalHeight + " px";

    resizerOriginalFileSize.textContent =
        formatResizerFileSize(file.size);

    // Set initial dimensions

    resizerWidth.value = originalWidth;
    resizerHeight.value = originalHeight;

    // Set initial output format

    if (file.type === "image/png") {
        resizerFormat.value = "image/png";
    } else if (file.type === "image/webp") {
        resizerFormat.value = "image/webp";
    } else {
        resizerFormat.value = "image/jpeg";
    }

    // Reset output information

    resizedBlob = null;

    resizerResultDimensions.textContent = "-- × -- px";
    resizerResultFileSize.textContent = "--";

    resizerOriginalSizeStat.textContent =
        formatResizerFileSize(file.size);

    resizerResultSizeStat.textContent = "--";
    resizerSpaceSavedStat.textContent = "--";

    downloadResizedBtn.disabled = true;

    // Reset result image visibility

    if (resultEmpty) {
        resultEmpty.style.display = "block";
    }

    showResizerMessage(
        "Image loaded successfully. Set your dimensions and resize.",
        "success"
    );

};

image.onerror = function() {

    URL.revokeObjectURL(temporaryURL);

    showResizerMessage(
        "This image could not be opened. Please choose another image.",
        "error"
    );

};

image.src = temporaryURL;

}

















// ================================
// DRAG AND DROP
// ================================

resizerUploadArea.addEventListener("dragover", function(event) {

event.preventDefault();

resizerUploadArea.classList.add("drag-active");

});

resizerUploadArea.addEventListener("dragleave", function() {

resizerUploadArea.classList.remove("drag-active");

});

resizerUploadArea.addEventListener("drop", function(event) {

event.preventDefault();

resizerUploadArea.classList.remove("drag-active");

var files = event.dataTransfer.files;

if (files.length > 0) {

    loadResizerImage(files[0]);

}

});

// ================================
// UPDATE WIDTH USING ASPECT RATIO
// ================================

resizerWidth.addEventListener("input", function() {

if (!originalImage) {
    return;
}

if (maintainAspectRatio.checked) {

    var width = Number(resizerWidth.value);

    if (width > 0) {

        var height = Math.round(
            width * originalHeight / originalWidth
        );

        resizerHeight.value = height;

    }

}

});

// ================================
// UPDATE HEIGHT USING ASPECT RATIO
// ================================

resizerHeight.addEventListener("input", function() {

if (!originalImage) {
    return;
}

if (maintainAspectRatio.checked) {

    var height = Number(resizerHeight.value);

    if (height > 0) {

        var width = Math.round(
            height * originalWidth / originalHeight
        );

        resizerWidth.value = width;

    }

}

});

// ================================
// UPDATE QUALITY VALUE
// ================================

resizerQuality.addEventListener("input", function() {

resizerQualityValue.textContent =
    resizerQuality.value + "%";

});

// ================================
// RESET OLD RESULT
// ================================

function clearResizerResult() {

if (resizedImageURL) {

    URL.revokeObjectURL(resizedImageURL);

    resizedImageURL = null;

}

resizedBlob = null;

resizerResultPreview.removeAttribute("src");
resizerResultPreview.hidden = true;

var emptyPreview = resizerResultPreviewBox.querySelector(
    ".resizer-empty-preview"
);

if (emptyPreview) {
    emptyPreview.style.display = "block";
}

resizerResultDimensions.textContent = "-- × -- px";
resizerResultFileSize.textContent = "--";

resizerResultSizeStat.textContent = "--";
resizerSpaceSavedStat.textContent = "--";

downloadResizedBtn.disabled = true;

}

// ================================
// RESIZE IMAGE
// ================================

resizeImageBtn.addEventListener("click", function() {

clearResizerMessage();

if (!originalImage) {

    showResizerMessage(
        "Please upload an image first.",
        "error"
    );

    return;
}

var width = Number(resizerWidth.value);
var height = Number(resizerHeight.value);

if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
) {

    showResizerMessage(
        "Please enter valid width and height values.",
        "error"
    );

    return;
}

if (width > 10000 || height > 10000) {

    showResizerMessage(
        "Width and height cannot exceed 10,000 pixels.",
        "error"
    );

    return;
}

// Prevent excessively large canvas output

if (width * height > 40000000) {

    showResizerMessage(
        "These dimensions are too large. Please choose smaller dimensions.",
        "error"
    );

    return;
}

clearResizerResult();

resizeImageBtn.disabled = true;

resizeImageBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Resizing...';

// Give the browser time to update the button

setTimeout(function() {

    try {

        var canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Canvas is not supported.");
        }

        // Fill a white background for JPG output.
        // JPG does not support transparency.

        if (resizerFormat.value === "image/jpeg") {

            context.fillStyle = "#ffffff";

            context.fillRect(0, 0, width, height);

        }

        // Draw resized image

        context.drawImage(
            originalImage,
            0,
            0,
            width,
            height
        );

        var outputFormat = resizerFormat.value;

        var quality = Number(resizerQuality.value) / 100;

        canvas.toBlob(function(blob) {

            if (!blob) {

                resizeImageBtn.disabled = false;

                resizeImageBtn.innerHTML =
                    '<i class="fa-solid fa-expand"></i> Resize Image';

                showResizerMessage(
                    "The image could not be resized. Try another format or smaller dimensions.",
                    "error"
                );

                return;
            }

            // Release previous result URL, if any

            if (resizedImageURL) {
                URL.revokeObjectURL(resizedImageURL);
            }

            resizedBlob = blob;

            resizedImageURL = URL.createObjectURL(blob);

            // Show resized image

            resizerResultPreview.src = resizedImageURL;
            resizerResultPreview.hidden = false;

            var emptyPreview = resizerResultPreviewBox.querySelector(
                ".resizer-empty-preview"
            );

            if (emptyPreview) {
                emptyPreview.style.display = "none";
            }

            // Update result information

            resizerResultDimensions.textContent =
                width + " × " + height + " px";

            resizerResultFileSize.textContent =
                formatResizerFileSize(blob.size);

            resizerResultSizeStat.textContent =
                formatResizerFileSize(blob.size);

            // Calculate file-size difference

            var difference = originalImageFile.size - blob.size;

            if (difference > 0) {

                var percentage = (
                    difference / originalImageFile.size
                ) * 100;

                resizerSpaceSavedStat.textContent =
                    formatResizerFileSize(difference) +
                    " (" + percentage.toFixed(1) + "% smaller)";

            } else if (difference < 0) {

                var increase = Math.abs(difference);

                var increasePercentage = (
                    increase / originalImageFile.size
                ) * 100;

                resizerSpaceSavedStat.textContent =
                    formatResizerFileSize(increase) +
                    " (" + increasePercentage.toFixed(1) + "% larger)";

            } else {

                resizerSpaceSavedStat.textContent =
                    "Same file size";

            }

            // Enable download

            downloadResizedBtn.disabled = false;

            resizeImageBtn.disabled = false;

            resizeImageBtn.innerHTML =
                '<i class="fa-solid fa-expand"></i> Resize Image';

            showResizerMessage(
                "Your image has been resized successfully!",
                "success"
            );

        }, outputFormat, quality);

    } catch (error) {

        resizeImageBtn.disabled = false;

        resizeImageBtn.innerHTML =
            '<i class="fa-solid fa-expand"></i> Resize Image';

        showResizerMessage(
            "Something went wrong while resizing. Try smaller dimensions.",
            "error"
        );

    }

}, 50);

});

















// ================================
// DOWNLOAD RESIZED IMAGE
// ================================

downloadResizedBtn.addEventListener("click", function() {

if (!resizedBlob || !resizedImageURL) {

    showResizerMessage(
        "Please resize your image before downloading.",
        "error"
    );

    return;
}

var extension = "jpg";

if (resizedBlob.type === "image/png") {

    extension = "png";

} else if (resizedBlob.type === "image/webp") {

    extension = "webp";

}

var originalName = originalImageFile.name;

var dotPosition = originalName.lastIndexOf(".");

var baseName = dotPosition > 0
    ? originalName.substring(0, dotPosition)
    : originalName;

var downloadName = baseName + "-resized." + extension;

var downloadLink = document.createElement("a");

downloadLink.href = resizedImageURL;

downloadLink.download = downloadName;

document.body.appendChild(downloadLink);

downloadLink.click();

document.body.removeChild(downloadLink);

showResizerMessage(
    "Your resized image is ready for download.",
    "success"
);

});

// ================================
// RESET THE TOOL
// ================================

resetResizerBtn.addEventListener("click", function() {

// Clear selected file

resizerFile.value = "";

// Release stored image URLs

if (originalImageURL) {

    URL.revokeObjectURL(originalImageURL);

    originalImageURL = null;

}

if (resizedImageURL) {

    URL.revokeObjectURL(resizedImageURL);

    resizedImageURL = null;

}

// Reset image variables

originalImage = null;
originalImageFile = null;
resizedBlob = null;

originalWidth = 0;
originalHeight = 0;

// Clear original preview

resizerOriginalPreview.removeAttribute("src");
resizerOriginalPreview.hidden = true;

var originalEmpty = resizerOriginalPreviewBox.querySelector(
    ".resizer-empty-preview"
);

if (originalEmpty) {
    originalEmpty.style.display = "block";
}

// Clear resized preview

resizerResultPreview.removeAttribute("src");
resizerResultPreview.hidden = true;

var resultEmpty = resizerResultPreviewBox.querySelector(
    ".resizer-empty-preview"
);

if (resultEmpty) {
    resultEmpty.style.display = "block";
}

// Reset dimensions and file information

resizerWidth.value = "";
resizerHeight.value = "";

resizerOriginalFileName.textContent = "Not selected";

resizerOriginalDimensions.textContent = "-- × -- px";
resizerOriginalFileSize.textContent = "--";

resizerResultDimensions.textContent = "-- × -- px";
resizerResultFileSize.textContent = "--";

// Reset statistics

resizerOriginalSizeStat.textContent = "--";
resizerResultSizeStat.textContent = "--";
resizerSpaceSavedStat.textContent = "--";

// Reset settings

maintainAspectRatio.checked = true;

resizerFormat.value = "image/jpeg";

resizerQuality.value = 90;

resizerQualityValue.textContent = "90%";

// Reset buttons and messages

downloadResizedBtn.disabled = true;

resizeImageBtn.disabled = false;

resizeImageBtn.innerHTML =
    '<i class="fa-solid fa-expand"></i> Resize Image';

clearResizerMessage();

});