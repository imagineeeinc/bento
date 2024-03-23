export function sendFile(url, file) {
	let formData = new FormData()
	formData.append("photo", file)

	let res = fetch(url, {
    method: "POST",
    body: formData
	})
  res = res.json()
  if (res.error) {
		return alert(error)
  }
  return url
}