// Button Status
const listButtonStatus = document.querySelectorAll("[button-status]");

if (listButtonStatus.length > 0) {
    listButtonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            let url = new URL(location.href);

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            location.href = url.href;
        });
    });
}

// End Button Status

// Form Search
const searchForm = document.querySelector("#form-search");

if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let url = new URL(location.href);

        const keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        location.href = url.href;
    });
}

// End Form Search

// Pagination
const listButtonPagination = document.querySelectorAll("[button-pagination]");

if (listButtonPagination.length) {
    listButtonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            url = new URL(location.href);
            url.searchParams.set("page", page);
            location.href = url;
        });
    });
}
// End Pagination

// Button-change-status
const listButtonChangeStatus = document.querySelectorAll(
    "[button-change-status]"
);

if (listButtonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("[form-change-status]");
    const path = formChangeStatus.getAttribute("data-path");

    listButtonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const status = button.getAttribute("data-status");
            const action = `${path}/${status}/${id}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}
// End Button-change-status

// Checkbox-multi
const checkboxMulti = document.querySelector("[checkbox-multi]");

if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector(
        "input[name='check-all']"
    );
    const listInputId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        listInputId.forEach((input) => {
            input.checked = inputCheckAll.checked;
        });
    });

    listInputId.forEach((input) => {
        input.addEventListener("click", () => {
            const lengthInputIdChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            if (lengthInputIdChecked == listInputId.length) {
                inputCheckAll.checked = true;
            }
        });
    });
}
// End Checkbox-multi

// Form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = formChangeMulti.querySelector("select[name=type]").value;

        const listInputIdChecked = document.querySelectorAll(
            "input[name='id']:checked"
        );

        if (listButtonChangeStatus.length > 0) {
            const ids = [];

            listInputIdChecked.forEach((input) => {
                let value = input.value;

                if (type == "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector('input[name="position"]').value;
                    value = `${value}-${position}`;
                }

                ids.push(value);
            });

            const stringIds = ids.join(", ");

            const input = formChangeMulti.querySelector("input[name='ids']");

            input.value = stringIds;

            if (type == "delete-all") {
                const isConfirm = confirm("Bạn có chắc chắn xóa không?");
                if (!isConfirm) return;
            }
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi!");
        }
    });
}
// End Form-change-multi

// Show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    let time = showAlert.getAttribute("data-time");
    time = parseInt(time);

    // Sau time giây sẽ đóng thông báo
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    // Khi click vào nút close-alert sẽ đóng luôn
    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End show-alert

// Button-delete
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
    const formDeleteItem = document.querySelector("[form-delete-item]");
    const path = formDeleteItem.getAttribute("data-path");
    listButtonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa không?");

            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
// End Button-delete

// Button-trash
const listButtonTrash = document.querySelectorAll("[button-trash]");

if (listButtonTrash.length > 0) {
    const formDeleteTrash = document.querySelector("[form-delete-trash]");
    const path = formDeleteTrash.getAttribute("data-path");

    listButtonTrash.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const action = `${path}/${id}?_method=DELETE`;

            formDeleteTrash.action = action;
            formDeleteTrash.submit();
        });
    });
}
// End Button-trash

// Upload-image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector(
        "[upload-image-preview]"
    );

    uploadImageInput.addEventListener("change", () => {
        const [file] = uploadImageInput.files;
        console.log(uploadImageInput.files);
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End Upload-image
