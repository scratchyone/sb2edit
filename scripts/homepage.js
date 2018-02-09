function openfromurl() {
    document.getElementById("openfromurlbar").style.visibility = ""
    if (!self.fetch) {
        document.getElementById("errormodaltitle").innerHTML = "Error: Fetch not found";
        document.getElementById("errormodalmessage").innerHTML = "Your browser does not support fetch! If you have a newer browser, please make an issue <a href='https://github.com/scratchyone/sb2edit/issues/new?title=" + "Error: Fetch not found" + "&body=" + encodeURIComponent(navigator.userAgent) + " ERROR: Fetch not found!''" + ">here</a>. Please keep the prefilled data, and add anything else you would like.";
        $("#open").closeModal();
        $("#openurl").closeModal();
        $("#error").openModal();
    }
    window.location = "/sb2edit/edit/?url=" + encodeURIComponent(document.getElementById("openurlfield").value)
}
document.body.onload=() => {
let input=document.getElementById("openurlfield")
input.onkeydown= (e) => {
	setTimeout(()=>{
		let v=input.value
v="https://scratch.mit.edu/projects/"+v.replace(/[^\d]/g,'')
		input.value=v
	}
		,5)
}
}
