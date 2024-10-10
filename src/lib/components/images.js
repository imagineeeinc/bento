// TODO: Store images in the database
export async function sendFile(url, file) {
	let formData = new FormData()
	formData.append("photo", file)

	let res = await fetch(url, {
    method: "POST",
    body: formData
	})
  res = await res.json()
  if (res.error) {
		return alert(error)
  }
  return res.url
}