import React from 'react'
import io from 'socket.io-client'
import $ from 'jquery'
import './Board.css'

class Board extends React.Component {

    timeout
    socket = io()

    ctx
    isDrawing = false

    constructor(props) {
        super(props)

        this.socket.on("canvas-data", function(data){

            $(`.board-container`).css({"background": `${data.canvasbgclr}`})
            let root = this
            let interval = setInterval(function(){
                if(root.isDrawing) return
                root.isDrawing = true
                clearInterval(interval)
                let image = new Image()
                let canvas = document.querySelector('#board')
                let ctx = canvas.getContext('2d')
                image.onload = function() {
                    ctx.drawImage(image, 0, 0)

                    root.isDrawing = false
                }
                image.src = data.base64ImageData
            }, 200)

        })
    }

    componentDidMount() {
        this.drawOnCanvas()
    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color
        this.ctx.lineWidth = newProps.size
        this.ctx.canvasbgclr = this.props.canvasbgclr
    }

    drawOnCanvas() {
        let canvas = document.querySelector('#board')
        this.ctx = canvas.getContext('2d')
        let ctx = this.ctx

        let sketch = document.querySelector('#sketch')
        let sketch_style = getComputedStyle(sketch)
        canvas.width = parseInt(sketch_style.getPropertyValue('width'))
        canvas.height = parseInt(sketch_style.getPropertyValue('height'))

        let mouse = {x: 0, y: 0}
        let last_mouse = {x: 0, y: 0}

        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x
            last_mouse.y = mouse.y

            mouse.x = e.pageX - this.offsetLeft
            mouse.y = e.pageY - this.offsetTop
        }, false)

        ctx.lineWidth = this.props.size
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.strokeStyle = this.props.color

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false)
        }, false)

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false)
        }, false)

        let root = this
        let onPaint = function() {
            ctx.beginPath()
            ctx.moveTo(last_mouse.x, last_mouse.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.closePath()
            ctx.stroke()

            if(root.timeout != undefined) clearTimeout(root.timeout)
            root.timeout = setTimeout(function(){
                let base64ImageData = canvas.toDataURL("image/png")
                root.socket.emit("canvas-data", {base64ImageData, canvasbgclr: `${ctx.canvasbgclr}`})
            }, 1000)
        }
    }

    render() {
        return (
            <div className="sketch" id="sketch">
                <canvas className="board" id="board"></canvas>
            </div>
        )
    }
}

export default Board