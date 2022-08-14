const play_button_img = document.getElementById('playbuttonimg')
const play32_button_img = document.getElementById('play32buttonimg')
const flag_button_img = document.getElementById('flagbuttonimg')
const pause_button_img = document.getElementById('pausebuttonimg')
const reset_button_img = document.getElementById('resetbuttonimg')
const timer_tracker = document.getElementById('timer_tracker')
const flag = document.getElementById('flag')
const flagtext = document.getElementById('flagtext')
const prev_sec = chrome.storage.sync.get(['start_time_ms'], function (items) {
	console.log(items)
	if (items.start_time_ms) start(items.start_time_ms)
})
const prev_flag = chrome.storage.sync.get(['flag'], function (items) {
	console.log(items)
	if (items.flag) flag.innerHTML = items.flag
})

play_button_img.addEventListener('click', (event) => {
	chrome.storage.sync.remove(['position'], function () {
		var error = chrome.runtime.lastError
		if (error) {
			console.error(error)
		}
	})
	start()
})

play32_button_img.addEventListener('click', async (event) => {
	chrome.storage.sync.get(['start_time_ms'], function (items) {
		let ttt
		let t
		console.log(items)
		console.log(items.start_time_ms)
		if (items.start_time_ms) {
			t = parseInt(items.start_time_ms)
		}
		chrome.storage.sync.get(['position'], function (items) {
			console.log('t ' + t)
			if (items.position) ttt = parseInt(parseInt(items.position.split('-')[1]) - t)
		})
		chrome.storage.sync.remove(['position'], function () {
			var error = chrome.runtime.lastError
			if (error) {
				console.error(error)
			}
			let tt = Date.now()
			console.log('ttt ' + ttt)
			const result = parseInt(tt - ttt)
			console.log(result)
			flag_button_img.style.display = 'block'
			pause_button_img.style.display = 'block'
			reset_button_img.style.display = 'block'
			play_button_img.style.display = 'none'
			play32_button_img.style.display = 'none'
			chrome.storage.sync.remove(['start_time_ms'], function () {
				var error = chrome.runtime.lastError
				if (error) {
					console.error(error)
				}
			})
			storeData({ start_time_ms: result }).then(() => {
				location.reload()
			})
		})
	})
})

reset_button_img.addEventListener('click', (event) => {
	chrome.storage.sync.remove(['position'], function () {
		var error = chrome.runtime.lastError
		if (error) {
			console.error(error)
		}
	})
	chrome.storage.sync.remove(['flag'], function () {
		var error = chrome.runtime.lastError
		if (error) {
			console.error(error)
		}
	})
	chrome.storage.sync.remove(['start_time_ms'], function () {
		var error = chrome.runtime.lastError
		if (error) {
			console.error(error)
		}
		location.reload()
	})
})

pause_button_img.addEventListener('click', (event) => {
	pause()
})

flag_button_img.addEventListener('click', (event) => {
	const prev_flag_content = flag.innerHTML
	const time = timer_tracker.innerHTML

	if (prev_flag_content && prev_flag_content !== null && prev_flag_content !== undefined) {
		storeData({ flag: time + '<br>' + prev_flag_content })
		flag.innerHTML = time + '<br>' + prev_flag_content
	} else {
		storeData({ flag: time })
		flag.innerHTML = time
	}
})

function pause() {
	storeData({ position: 'pause-' + Date.now() })
	flag_button_img.style.display = 'block'
	pause_button_img.style.display = 'none'
	reset_button_img.style.display = 'block'
	play32_button_img.style.display = 'block'
}

async function start(time) {
	let _start_time_ms = Date.now()
	if (!time) {
		storeData({ start_time_ms: _start_time_ms })
	} else {
		_start_time_ms = time
	}
	flag_button_img.style.display = 'block'
	pause_button_img.style.display = 'block'
	reset_button_img.style.display = 'block'
	play_button_img.style.display = 'none'
	play32_button_img.style.display = 'none'
	flagtext.style.display = 'block'
	const tracker = setInterval(() => {
		timer(_start_time_ms)
	}, 100)
}

async function timer(start_time_ms) {
	let t = start_time_ms
	let now = Date.now()
	chrome.storage.sync.get(['position'], function (items) {
		if (items.position) {
			if (items.position.includes('pause')) {
				now = parseInt(items.position.split('-')[1])
				flag_button_img.style.display = 'block'
				pause_button_img.style.display = 'none'
				reset_button_img.style.display = 'block'
				play32_button_img.style.display = 'block'
			}
		}
		const ellapsed_ms = parseInt(now - parseInt(t))
		const _ellapsed_sec = Math.trunc(ellapsed_ms / 1000)
		const ellapsed_sec = _ellapsed_sec % 60
		const _ellapsed_min = Math.trunc(_ellapsed_sec / 60)
		const ellapsed_min = _ellapsed_min % 60
		const ellapsed_hours = Math.trunc(ellapsed_min / 60)
		let sec = ellapsed_sec.toString()
		let min = ellapsed_min.toString()
		let hours = ellapsed_hours.toString()
		if (ellapsed_sec < 10) {
			sec = '0' + ellapsed_sec.toString()
		}
		if (ellapsed_min < 10) {
			min = '0' + ellapsed_min.toString()
		}
		if (ellapsed_hours < 10) {
			hours = '0' + ellapsed_hours.toString()
		}
		//console.log(hours + ':' + min + ':' + sec)

		timer_tracker.innerHTML = hours + ':' + min + ':' + sec
	})
}

async function storeData(obj) {
	console.log(obj)
	await chrome.storage.sync.set(obj, function () {
		//  Data's been saved boys and girls, go on home
	})
}
