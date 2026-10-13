
var compressorFile = document.getElementById("compressorFile");
var chooseImageBtn = document.getElementById("chooseImageBtn");
var compressorUploadArea = document.getElementById("compressorUploadArea");

var originalImagePreview = document.getElementById("originalImagePreview");
var originalImageSize = document.getElementById("originalImageSize");
var originalFileName = document.getElementById("originalFileName");
var originalImageDimensions = document.getElementById("originalImageDimensions");
var originalFileSize = document.getElementById("originalFileSize");

var compressionQuality = document.getElementById("compressionQuality");
var compressionQualityValue = document.getElementById("compressionQualityValue");
var compressionFormat = document.getElementById("compressionFormat");
var compressImageBtn = document.getElementById("compressImageBtn");

var compressedImagePreview = document.getElementById("compressedImagePreview");
var compressedImageSize = document.getElementById("compressedImageSize");

var originalSizeStat = document.getElementById("originalSizeStat");
var compressedSizeStat = document.getElementById("compressedSizeStat");
var spaceSavedStat = document.getElementById("spaceSavedStat");

var compressorSavingsBox = document.getElementById("compressorSavingsBox");
var compressionSavingsTitle = document.getElementById("compressionSavingsTitle");
var compressionSavingsText = document.getElementById("compressionSavingsText");

var downloadCompressedBtn = document.getElementById("downloadCompressedBtn");
var resetCompressorBtn = document.getElementById("resetCompressorBtn");
var compressorMessage = document.getElementById("compressorMessage");

var selectedImage = null;
var originalImageURL = null;
var compressedImageURL = null;
var compressedBlob = null;
var compressedFileExtension = "";


// ==================================
// FORMAT FILE SIZE
// ==================================

function formatImageSize(bytes) {

    if (bytes < 1024) {
        return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}


// ==================================
// SHOW MESSAGE
// ==================================

function showCompressorMessage(message, type) {

    compressorMessage.textContent = message;

    compressorMessage.className = "compressor-message";

    if (type) {
        compressorMessage.classList.add(type);
    }
}


// ==================================
// CLEAR COMPRESSED RESULT
// ==================================

function clearCompressedResult() {

    if (compressedImageURL) {
        URL.revokeObjectURL(compressedImageURL);
        compressedImageURL = null;
    }

    compressedBlob = null;
    compressedFileExtension = "";

    compressedImagePreview.removeAttribute("src");
    compressedImagePreview.style.display = "none";

    compressedImageSize.textContent = "—";

    originalSizeStat.textContent = "—";
    compressedSizeStat.textContent = "—";
    spaceSavedStat.textContent = "—";

    compressorSavingsBox.style.display = "none";

    downloadCompressedBtn.disabled = true;
}


// ==================================
// SHOW EMPTY PREVIEW
// ==================================

function showEmptyPreview(previewBox, imageElement) {

    imageElement.style.display = "none";
    imageElement.removeAttribute("src");

    var emptyPreview = previewBox.querySelector(".compressor-empty-preview");

    if (emptyPreview) {
        emptyPreview.style.display = "flex";
    }
}


// ==================================
// SHOW IMAGE PREVIEW
// ==================================

function showImagePreview(previewBox, imageElement, imageURL) {

    var emptyPreview = previewBox.querySelector(".compressor-empty-preview");

    if (emptyPreview) {
        emptyPreview.style.display = "none";
    }

    imageElement.src = imageURL;
    imageElement.style.display = "block";
}


// ==================================
// LOAD SELECTED IMAGE
// ==================================

function loadSelectedImage(file) {

    if (!file) {
        return;
    }

    // Check file size: maximum 15 MB

    var maximumSize = 15 * 1024 * 1024;

    if (file.size > maximumSize) {

        showCompressorMessage(
            "This image is too large. Please choose an image below 15 MB.",
            "error"
        );

        return;
    }

    // Check image format

    var allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    var fileNameLower = file.name.toLowerCase();

    var validExtension =
        fileNameLower.endsWith(".jpg") ||
        fileNameLower.endsWith(".jpeg") ||
        fileNameLower.endsWith(".png") ||
        fileNameLower.endsWith(".webp");

    if (
        !allowedTypes.includes(file.type) &&
        !validExtension
    ) {

        showCompressorMessage(
            "Please choose a JPG, PNG, or WebP image.",
            "error"
        );

        return;
    }

    // Clear the previous original image URL

    if (originalImageURL) {
        URL.revokeObjectURL(originalImageURL);
        originalImageURL = null;
    }

    // Clear the previous compressed result

    clearCompressedResult();

    selectedImage = file;

    originalImageURL = URL.createObjectURL(file);

    var image = new Image();

    image.onload = function () {

        showImagePreview(
            document.getElementById("originalPreviewBox"),
            originalImagePreview,
            originalImageURL
        );

        originalFileName.textContent = file.name;

        originalImageDimensions.textContent =
            image.naturalWidth + " × " +
            image.naturalHeight + " px";

        originalFileSize.textContent =
            formatImageSize(file.size);

        originalImageSize.textContent =
            formatImageSize(file.size);

        originalSizeStat.textContent =
            formatImageSize(file.size);

        compressImageBtn.disabled = false;

        showCompressorMessage(
            "Image loaded successfully. You can now compress it.",
            "success"
        );
    };

    image.onerror = function () {

        selectedImage = null;

        compressImageBtn.disabled = true;

        showCompressorMessage(
            "This image could not be opened. Please choose another image.",
            "error"
        );
    };

    image.src = originalImageURL;
}


// ==================================
// CHOOSE IMAGE BUTTON
// ==================================

chooseImageBtn.addEventListener("click", function () {

    compressorFile.click();

});


// ==================================
// FILE INPUT
// ==================================

compressorFile.addEventListener("change", function () {

    var file = compressorFile.files[0];

    if (file) {
        loadSelectedImage(file);
    }

});


// ==================================
// DRAG AND DROP
// ==================================

compressorUploadArea.addEventListener("dragover", function (event) {

    event.preventDefault();

    compressorUploadArea.classList.add("drag-over");

});


compressorUploadArea.addEventListener("dragleave", function () {

    compressorUploadArea.classList.remove("drag-over");

});


compressorUploadArea.addEventListener("drop", function (event) {

    event.preventDefault();

    compressorUploadArea.classList.remove("drag-over");

    var file = event.dataTransfer.files[0];

    if (file) {
        loadSelectedImage(file);
    }

});


// ==================================
// QUALITY SLIDER
// ==================================

compressionQuality.addEventListener("input", function () {

    compressionQualityValue.textContent =
        compressionQuality.value + "%";

});


// ==================================
// COMPRESS IMAGE
// ==================================

compressImageBtn.addEventListener("click", function () {

    if (!selectedImage) {

        showCompressorMessage(
            "Please choose an image first.",
            "error"
        );

        return;
    }

    compressImageBtn.disabled = true;

    showCompressorMessage(
        "Compressing your image. Please wait...",
        "success"
    );

    var image = new Image();

    image.onload = function () {

        var canvas = document.createElement("canvas");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        var context = canvas.getContext("2d");

        if (!context) {

            compressImageBtn.disabled = false;

            showCompressorMessage(
                "Your browser could not process this image.",
                "error"
            );

            return;
        }

        var outputFormat = compressionFormat.value;

        var quality =
            parseInt(compressionQuality.value, 10) / 100;

        // JPEG does not support transparency.
        // Use a white background for JPEG output.

        if (outputFormat === "image/jpeg") {

            context.fillStyle = "#ffffff";

            context.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }

        // Draw the original image onto the canvas

        context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Create the compressed image

        canvas.toBlob(function (blob) {

            compressImageBtn.disabled = false;

            if (!blob) {

                showCompressorMessage(
                    "Compression failed. Please try another format.",
                    "error"
                );

                return;
            }

            // Confirm the browser created the requested format

            if (blob.type !== outputFormat) {

                showCompressorMessage(
                    "Your browser could not create that format. Please try JPEG or PNG.",
                    "error"
                );

                return;
            }

            // Remove the previous compressed URL

            if (compressedImageURL) {
                URL.revokeObjectURL(compressedImageURL);
            }

            compressedBlob = blob;

            compressedImageURL = URL.createObjectURL(blob);

            // Set the correct file extension

            if (blob.type === "image/jpeg") {

                compressedFileExtension = ".jpg";

            } else if (blob.type === "image/webp") {

                compressedFileExtension = ".webp";

            } else {

                compressedFileExtension = ".png";
            }

            // Show the compressed preview

            // showImagePreview(
            //     document.getElementById("compressedPreviewBox"),
            //     compressedImagePreview,
            //     compressedImageURL
            // );


// Show the compressed preview

var compressedPreviewBox = document.getElementById("compressedPreviewBox");

var emptyPreview = compressedPreviewBox.querySelector(".compressor-empty-preview");

if (emptyPreview) {
    emptyPreview.style.display = "none";
}

compressedImagePreview.src = compressedImageURL;

compressedImagePreview.style.display = "block";

compressedImagePreview.style.width = "100%";

compressedImagePreview.style.height = "auto";

compressedImagePreview.style.maxHeight = "350px";

compressedImagePreview.style.objectFit = "contain";


          
            // Show the compressed file size

            compressedImageSize.textContent =
                formatImageSize(blob.size);

            originalSizeStat.textContent =
                formatImageSize(selectedImage.size);

            compressedSizeStat.textContent =
                formatImageSize(blob.size);

            // Calculate the size difference

            var difference = selectedImage.size - blob.size;

            var percentage = (
                difference / selectedImage.size
            ) * 100;

            if (difference > 0) {

                spaceSavedStat.textContent =
                    percentage.toFixed(1) + "%";

                compressionSavingsTitle.textContent =
                    "Great! Your image is smaller.";

                compressionSavingsText.textContent =
                    "You saved " +
                    formatImageSize(difference) +
                    " (" + percentage.toFixed(1) +
                    "% of the original image size).";

            } else if (difference < 0) {

                spaceSavedStat.textContent =
                    "Increased " +
                    Math.abs(percentage).toFixed(1) + "%";

                compressionSavingsTitle.textContent =
                    "The new image is larger.";

                compressionSavingsText.textContent =
                    "The output increased by " +
                    formatImageSize(Math.abs(difference)) +
                    ". Try a different format or quality setting.";

            } else {

                spaceSavedStat.textContent = "0%";

                compressionSavingsTitle.textContent =
                    "No size change.";

                compressionSavingsText.textContent =
                    "The compressed image has the same file size as the original.";
            }

            compressorSavingsBox.style.display = "block";

            downloadCompressedBtn.disabled = false;

            showCompressorMessage(
                "Image compression completed successfully!",
                "success"
            );

        }, outputFormat, outputFormat === "image/png" ? undefined : quality);
    };

    image.onerror = function () {

        compressImageBtn.disabled = false;

        showCompressorMessage(
            "The image could not be processed. Please upload it again.",
            "error"
        );
    };

    image.src = originalImageURL;

});


// ==================================
// DOWNLOAD COMPRESSED IMAGE
// ==================================

downloadCompressedBtn.addEventListener("click", function () {

    if (!compressedBlob || !compressedImageURL) {

        showCompressorMessage(
            "Please compress an image before downloading.",
            "error"
        );

        return;
    }

    var originalName = selectedImage.name;

    // Remove the original file extension

    var fileName = originalName.replace(/\.[^/.]+$/, "");

    var downloadLink = document.createElement("a");

    downloadLink.href = compressedImageURL;

    downloadLink.download =
        fileName + "-compressed" + compressedFileExtension;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

    showCompressorMessage(
        "Your compressed image download has started.",
        "success"
    );

});


// ==================================
// RESET COMPRESSOR
// ==================================

resetCompressorBtn.addEventListener("click", function () {

    // Clear the selected image

    selectedImage = null;

    compressorFile.value = "";

    // Release the original image URL

    if (originalImageURL) {

        URL.revokeObjectURL(originalImageURL);

        originalImageURL = null;
    }

    // Clear compressed data

    clearCompressedResult();

    // Reset original preview

    showEmptyPreview(
        document.getElementById("originalPreviewBox"),
        originalImagePreview
    );

    originalImageSize.textContent = "—";

    originalFileName.textContent = "—";

    originalImageDimensions.textContent = "—";

    originalFileSize.textContent = "—";

    // Reset settings

    compressionQuality.value = 75;

    compressionQualityValue.textContent = "75%";

    compressionFormat.value = "image/jpeg";

    // Disable buttons

    compressImageBtn.disabled = true;

    downloadCompressedBtn.disabled = true;

    // Clear message

    compressorMessage.textContent = "";

    compressorMessage.className = "compressor-message";

});


// ==================================
// INITIAL SETTINGS
// ==================================

compressImageBtn.disabled = true;

downloadCompressedBtn.disabled = true;

compressionQualityValue.textContent =
    compressionQuality.value + "%";

showEmptyPreview(
    document.getElementById("originalPreviewBox"),
    originalImagePreview
);

showEmptyPreview(
    document.getElementById("compressedPreviewBox"),
    compressedImagePreview
);

clearCompressedResult();