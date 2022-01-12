var form = document.getElementById('join_form')

form.addEventListener('submit', function () {
	event.preventDefault()
	if (validate(this.civ_name.value)) {
		this.submit()
	}
})

const path = window.location.pathname
var parts = pathToArr(path)

const hiddenField = document.createElement('input')
hiddenField.type = 'hidden'
hiddenField.name = 'draftID'
hiddenField.value = parts[parts.length-1]
form.appendChild(hiddenField)

const hiddenField2 = document.createElement('input')
hiddenField2.type = 'hidden'
hiddenField2.name = 'joinType'
if (parts[parts.length-2] == 'host') {
	hiddenField2.value = 0
} else if (parts[parts.length-2] == 'player') {
	hiddenField2.value = 1
}
form.appendChild(hiddenField2)
