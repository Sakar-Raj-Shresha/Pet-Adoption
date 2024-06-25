let serverSignature
let serverTimestamp
let cloudinaryReturnedObject
let isFormLocked = false
async function getSignature() {
  const signaturePromise = await fetch("/.netlify/functions/getSignature")
  const theResponse = await signaturePromise.json()
  serverSignature = theResponse.signature
  serverTimestamp = theResponse.timestamp
}
getSignature()
document.querySelector("#file-field").addEventListener("change", async function () {
  isFormLocked = true
  document.querySelector("#submit-btn").style.opacity = ".1"
  const data = new FormData()
  data.append("file", document.querySelector("#file-field").files[0])
  data.append("api_key", "264591535821965")
  data.append("signature", serverSignature)
  data.append("timestamp", serverTimestamp)

  // send to cloudniary
  const cloudinaryResponse = await axios.post("https://api.cloudinary.com/v1_1/dhhoyblxa/auto/upload", data, {
    headers: { "content-type": "multipart/form-data" },
    onUploadProgress: function (e) {
      console.log(e.loaded / e.total)
    }
  })

  console.log(cloudinaryResponse.data)
  cloudinaryReturnedObject = cloudinaryResponse.data
  document.querySelector("#photo-preview").innerHTML = `<img src="https://res.cloudinary.com/dhhoyblxa/image/upload/w_190,h_190,c_fill/${cloudinaryResponse.data.public_id}.jpg" />`
  isFormLocked = false
  document.querySelector("#submit-btn").style.opacity = "1"
})