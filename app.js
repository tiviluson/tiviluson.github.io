const inputs = document.querySelectorAll('input,select');
const submitBtn = document.querySelector('#submit');
const form = document.querySelector('form');
let forms = document.querySelectorAll('.needs-validation');
let formData = new FormData(form);
let success = document.querySelector('#success-modal-toggler');
let failure = document.querySelector('#failure-modal-toggler');
let xClose = document.querySelector('#xCloseSuccess');
let download = document.querySelector('#download');
let baseURL = 'https://steganography-2022.herokuapp.com';
let content = document.querySelector('#form');
let tabs = document.querySelectorAll('.tab');
let msg = document.querySelector('#msg-col');
let msgInput = document.querySelector('#msg');
let downloadDecode = document.querySelector('#download-decode');
let isEmbedMode = false;
let sth = null, blob = null;
let embedEle = Array.from(document.querySelectorAll('.embed').values())
let decodeEle = Array.from(document.querySelectorAll('.decode').values())

function hide(eles) {
	eles.forEach(ele => ele.style.display = 'none');
}

function show(eles) {
	eles.forEach(ele => ele.style.display = '');
}

tabs[0].onclick = e => {
	msgInput.required = true;
	isEmbedMode = true;
	show([content, msg, ...embedEle])
	hide([...decodeEle])
	form.classList.remove('was-validated');
}

tabs[1].onclick = e => {
	content.style.display = '';
	msg.style.display = 'none'
	msgInput.required = false;
	msgInput.value = '';
	isEmbedMode = false;
	show([content, ...decodeEle])
	hide([msg, ...embedEle])
	form.classList.remove('was-validated');
}

submitBtn.onclick = e => {
	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function(form) {
		form.addEventListener(
			'submit',
			function(event) {
				event.preventDefault();
				event.stopPropagation();
				form.classList.add('was-validated');
				if (form.checkValidity()) {
					async function _embed(_data) {
						sth = await fetch(`${baseURL}/api/v1/encrypt`, {
							method  : 'POST',
							body: _data
						});
						
						if (sth) {
							blob = await sth.blob();
							console.log(blob);
							download.href = URL.createObjectURL(blob);
							success.click();
						}
						else {
							failure.click();
						}
					}
					
					async function _decode(_data) {
						sth = await fetch(`${baseURL}/api/v1/decrypt`, {
							method  : 'POST',
							body: _data
						});
						
						if (sth) {
							blob = await sth.json();
							blob = new Blob([blob.text], { type: "text/plain;charset=utf-8" });
							downloadDecode.href = URL.createObjectURL(blob);
							console.log(blob);
							success.click();
						}
						else {
							failure.click();
						}
					}

					formData = new FormData(form);
					entries = formData.entries();
					data = {};
					for (let entry of entries) {
						data[entry[0]] = entry[1];
					}
					console.log(data);
					submitBtn.disabled = true;
					if (isEmbedMode) {
						console.log('Embedding')
						_embed(formData);
					}
					else {
						console.log('Decoding')
						_decode(formData);
					}
				}
			},
			false
		);
	});
};