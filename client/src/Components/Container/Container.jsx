import React from 'react'
import { SketchPicker, BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, HuePicker, MaterialPicker, SwatchesPicker, TwitterPicker } from 'react-color'
import $ from 'jquery'
import Board from '../Board/Board'
import './Container.css'

class Container extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            brushColor: "",
            erasercolor: "",
            size: "2", //initial minimum brush size
            pickerType: "1", //default color picker type {1: SketchPicker}
            bgSettingOne: "#6b6b6b",
            bgSettingTwo: "#6cc26f"
            
        }
    }



    // // // // // // // // // // 
    lsTest = () => {
        let testLs = 'checkLocalStorage'
        try {
            localStorage.setItem(testLs, testLs)
            localStorage.removeItem(testLs)
            return true
        } catch(err) {
            return false
        }
    }
    
    localStorageSetGet = (props) => {
        try{
            $(`.settingRememberfld`).removeClass("active")
            if(this.lsTest() === true && typeof localStorage !== 'undefined'){
                if(props == "setLocal"){
                    $(`.settingRememberfld`).html(`<i className="fa fa-spinner" aria-hidden="true">&nbsp;Loading...</i>`)
                    $(`.settingRememberfld`).addClass("active")
                    let localStorageData = localStorage.getItem('settingRemember')
                    localStorageData = localStorageData ? JSON.parse(localStorageData) : {"rememberSetting" : []}
                    let layoutLocalStorageData = {
                            "pickerType": this.state.pickerType,
                            "bgSettingOne": this.state.bgSettingOne,
                            "bgSettingTwo": this.state.bgSettingTwo,
                            "date": `${new Date().toLocaleString().toString()} | ${new Date().toString()}`
                        }
                    localStorageData.rememberSetting = layoutLocalStorageData
                    localStorage.setItem('settingRemember', JSON.stringify(localStorageData))
                    setTimeout(function(){ $(`.settingRememberfld`).html(`<i className="zmdi zmdi-check-circle">&nbsp;Saved</i>`) }, 500);
                }else if(props == "getLocal"){
                    let localStorageData = localStorage.getItem('settingRemember')
                    localStorageData = localStorageData ? JSON.parse(localStorageData) : {"rememberSetting" : []}
                    localStorage.setItem('settingRemember', JSON.stringify(localStorageData))
                    if(localStorageData.rememberSetting != ""){
                        this.setState({
                            pickerType: localStorageData.rememberSetting.pickerType,
                            bgSettingOne: localStorageData.rememberSetting.bgSettingOne,
                            bgSettingTwo: localStorageData.rememberSetting.bgSettingTwo
                        })
                    }
                }
            }else{
                throw new Error("LocalStorageError: Can't Find Or Immutable Or Storage Limit Exceeded")
            } 
        }catch(err){
            console.log(err)
            $(`.settingRememberfld`).html(`<i className="zmdi zmdi-alert-polygon">&nbsp;Error : Can't Set As Default</i>`)
            $(`.settingRememberfld`).addClass("active bg-warning text-danger")
            $('.settingRememberfld').prop('title', `${err}`)
        }
    }
    // // // // // // // // // // 



    // // // // // // // // // // 
    penSelectClick = () => {
        this.setState({
            brushColor: $(`.penColorSelectCon i.fa-palette`).css("color")
        })
        $(`.penSizeCon i.active`).css({"color": `${$(".penColorSelectCon i.fa-palette").css("color")}`})
        $(`.penColorSelectCon i`).removeClass("active")
        $(`.eraserColorSelectCon i`).removeClass("active")
        $(`.penColorSelectCon i`).addClass("active")
        if($(`.penColorSelectCon .sketch-picker`).hasClass("active")){
            $(`.penColorSelectCon .sketch-picker`).removeClass("active")
        }else{
            $(`.sketch-picker`).removeClass("active")
            $(`.penColorSelectCon .sketch-picker`).addClass("active")
        }
    }
    // // // // // // // // // // 



    // // // // // // // // // // 
    eraserSelectClick = () => {
        this.setState({
            brushColor: $(`.eraserColorSelectCon i.fa-eraser`).css("color")
        })
        $(`.penSizeCon i.active`).css({"color": `${$(".eraserColorSelectCon i.fa-eraser").css("color")}`})
        $(`.penColorSelectCon i`).removeClass("active")
        $(`.eraserColorSelectCon i`).removeClass("active")
        $(`.eraserColorSelectCon i`).addClass("active")
    }
    // // // // // // // // // // 



    // // // // // // // // // // 
    penColorSelectChange = (color) => {
        $(`.penColorSelectCon i.fa-palette`).css({"color": `${color.hex}`})
        this.setState({brushColor: color.hex})
        $(`.penSizeCon i.active`).css({"color": `${color.hex}`})
    }
    // // // // // // // // // // 



    // // // // // // // // // // 
    bgAndEraserColorSelectChange = (color) => {
        $(`.board-container`).css({"background": `${color.hex}`})
        $(`.eraserColorSelectCon i.fa-eraser`).css({"color": `${color.hex}`})
        $(`.bgColorSelectCon i.zmdi-format-color-fill`).css({"color": `${color.hex}`})
        this.setState({
            erasercolor: color.hex
        })
        if($(`.eraserColorSelectCon i`).hasClass("active")){
            $(`.penSizeCon i.active`).css({"color": `${color.hex}`})
            this.setState({
                brushColor: color.hex
            })
        }
    }
    // // // // // // // // // // 



    // // // // // // // // // // 
    settingPickerTypeSelChange(params){
        this.setState({
            pickerType: params.target.value
        })
    }
    // // // // // // // // // // 



    // // // // // // // // // // 
    settingBgSelectorOne(params){
        this.setState({
            bgSettingOne: params.target.value
        })
        $(`.containerCus, .liveBgColorSetting`).css({"background": `linear-gradient(45deg, ${this.state.bgSettingOne}, ${this.state.bgSettingTwo})`})
    }
    settingBgSelectorTwo(params){
        this.setState({
            bgSettingTwo: params.target.value
        })
        $(`.containerCus, .liveBgColorSetting`).css({"background": `linear-gradient(45deg, ${this.state.bgSettingOne}, ${this.state.bgSettingTwo})`})
    }
    // // // // // // // // // // 

    

    componentDidMount() {
        this.localStorageSetGet("getLocal")
    }



    render() {


        // // // // // // // // // // 
       const changeBrushSizeClickSelect = (params) => {
            $(`.penSizeCon i`).removeClass("active")
            $(`.penSizeCon i`).css({"color": "#ffffff"})
            $(`.penSizeCon .penSize${params}`).css({"color": `${this.state.brushColor}`})
            $(`.penSizeCon .penSize${params}`).addClass("active")
            this.setState({
                size: params
            })
        }
        // // // // // // // // // // 



        // // // // // // // // // // 
        const pencilColorSellectClick = () => {
            $(`#penColorSelectModel`).addClass("active")
            $(`.modelBgOverlay`).addClass("active")
        }

        $(`.modelBgOverlay`).click(()=> {
            $(`#penColorSelectModel`).removeClass("active")
            $(`.modelBgOverlay`).removeClass("active")
        })
        // // // // // // // // // // 



        // // // // // // // // // // 
        const settingsModalBtnClick = () => {
            $(`.settingCon i.zmdi-settings`).addClass("active")
            $(`.settingRememberfld`).removeClass("active")
        }

        $(document).click(()=> {
            if(!$(`#settingsModal`).hasClass("show")){
                $(`.settingCon i.zmdi-settings`).removeClass("active")
            }
        })
        // // // // // // // // // 



        // // // // // // // // // 
        $(document).on('keydown', (e) => {
            if (e.altKey && e.key === 'p') {
                e.preventDefault()
                this.penSelectClick()
            }else if (e.altKey && e.key === 'c') {
                e.preventDefault()
                this.penSelectClick()
                pencilColorSellectClick()
            }else if (e.altKey && e.key === 'r') {
                e.preventDefault()
                this.eraserSelectClick()
            }else if (e.ctrlKey && e.altKey && e.key === "1") {
                changeBrushSizeClickSelect(2)
            }else if (e.ctrlKey && e.altKey && e.key === '2') {
                changeBrushSizeClickSelect(5)
            }else if (e.ctrlKey && e.altKey && e.key === '3') {
                changeBrushSizeClickSelect(10)
            }else if (e.ctrlKey && e.altKey && e.key === '4') {
                changeBrushSizeClickSelect(15)
            }else if (e.ctrlKey && e.altKey && e.key === '5') {
                changeBrushSizeClickSelect(20)
            }else if (e.ctrlKey && e.altKey && e.key === '6') {
                changeBrushSizeClickSelect(25)
            }
        })
        // // // // // // // // // 



        // // // // // // // // // 
        const colorPicker = (retWhat) => {
            if(retWhat == "penRet"){
                return (
                    <>
                        {(() => {
                            switch (this.state.pickerType) {
                            case "1" :    return <SketchPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange } />
                            case "2" :    return <BlockPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "3" :    return <ChromePicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "4" :    return <CirclePicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "5" :    return <CompactPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "6" :    return <GithubPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "7" :    return <HuePicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "8" :    return <MaterialPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "9" :  return <SwatchesPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            case "10" :  return <TwitterPicker color={ this.state.brushColor } onChange={ this.penColorSelectChange }/>
                            }
                        })()}
                    </>
                )
            }else if(retWhat == "esrBgRet"){
                return (
                    <>
                        {(() => {
                            switch (this.state.pickerType) {
                            case "1" :    return <SketchPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange } />
                            case "2" :    return <BlockPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "3" :    return <ChromePicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "4" :    return <CirclePicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "5" :    return <CompactPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "6" :    return <GithubPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "7" :    return <HuePicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "8" :    return <MaterialPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "9" :   return <SwatchesPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            case "10" :   return <TwitterPicker color={ this.state.erasercolor } onChange={ this.bgAndEraserColorSelectChange }/>
                            }
                        })()}
                    </>
                )
            }
        }



        $(document).ready(()=>{
            $(`.containerCus, .liveBgColorSetting`).css({"background": `linear-gradient(45deg, ${this.state.bgSettingOne}, ${this.state.bgSettingTwo})`})
            $(`.tools-section, .footer`).css({"opacity": "1"})
        })



        return (
            <div className="containerCus">
                <div className="tools-section d-f_jc-c_ai-c mb-1">

                    <div className="penColorSelectCon">
                        <i className="fas fa-palette active" title="Right Click Or Left Double Click To Open The Brush Color Palet Selector Tool  | Alt+r" onContextMenu={(e)=>{e.preventDefault();pencilColorSellectClick()}} onDoubleClick={(e)=>{e.preventDefault();pencilColorSellectClick()}} onClick={this.penSelectClick} ></i>
                        <div className="modalCus sketch-picker-com" id="penColorSelectModel">
                            <div className="modal-dialog m-0">
                                <div className="modal-content w-max-con bg-none border-none">
                                    <div className="modal-body p-0">
                                        <h4 className="tx-c colorPickerHeading">Select Brush Color</h4>
                                        {colorPicker("penRet")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modelBgOverlay"></div>
                    </div>

                    <div className="eraserColorSelectCon" title="Left Click To Select Eraser | Alt+r">
                        <i className="fas fa-eraser" onClick={this.eraserSelectClick}></i>
                    </div>

                    <div className="bgColorSelectCon">
                        <i className="zmdi zmdi-format-color-fill" title="Left Click To Open Board Color Palet" data-bs-toggle="modal" data-bs-target="#bgcolorsel"></i>
                        <div className="modal fade" id="bgcolorsel" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog m-0">
                                <div className="modal-content w-max-con bg-none border-none">
                                    <div className="modal-body p-0">
                                        <h4 className="tx-c colorPickerHeading">Select Board Color</h4>
                                        {colorPicker("esrBgRet")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="penSizeCon">
                        <span>
                            <i onClick={()=>{changeBrushSizeClickSelect(2)}} title="Left Click To Select Size 2 | Ctrl+Alt+1" className="zmdi zmdi-edit penSize2 active"></i>
                            <i onClick={()=>{changeBrushSizeClickSelect(5)}} title="Left Click To Select Size 5 | Ctrl+Alt+2" className="fas fa-pencil-alt penSize5"></i>
                            <i onClick={()=>{changeBrushSizeClickSelect(10)}} title="Left Click To Select Size 10 | Ctrl+Alt+3" className="zmdi zmdi-brush penSize10"></i>
                        </span>
                        <span>
                            <i onClick={()=>{changeBrushSizeClickSelect(15)}} title="Left Click To Select Size 15 | Ctrl+Alt+4" className="fas fa-paint-brush penSize15"></i>
                            <i onClick={()=>{changeBrushSizeClickSelect(20)}} title="Left Click To Select Size 20 | Ctrl+Alt+5" className="fas fa-brush penSize20"></i>
                            <i onClick={()=>{changeBrushSizeClickSelect(25)}} title="Left Click To Select Size 25 | Ctrl+Alt+6" className="fas fa-paint-roller penSize25"></i>
                        </span>
                    </div>

                    <div className="setManiCon">
                        <div className="settingCon">
                            <i className="zmdi zmdi-settings" title="Left Click To Open Setting's | Alt+s" onClick={()=>{settingsModalBtnClick()}} data-bs-toggle="modal" data-bs-target="#settingsModal"></i>
                            <div className="modal fade" id="settingsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog m-0">
                                    <div className="modal-content w-max-con">
                                        <div className="modal-body">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label htmlFor="settingPickerType">Select Color Picker Type : &nbsp;</label>
                                                <select id="settingPickerType" value={this.state.pickerType} onChange={this.settingPickerTypeSelChange.bind(this)}>
                                                    <option value="1">SketchPicker</option>
                                                    <option value="2">BlockPicker</option>
                                                    <option value="3">ChromePicker</option>
                                                    <option value="4">CirclePicker</option>
                                                    <option value="5">CompactPicker</option>
                                                    <option value="6">GithubPicker</option>
                                                    <option value="7">HuePicker</option>
                                                    <option value="8">MaterialPicker</option>
                                                    <option value="9">SwatchesPicker</option>
                                                    <option value="10">TwitterPicker</option>
                                                </select>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label htmlFor="settingBgColor">Select Background Color : &nbsp;</label>
                                                <span className="d-f_jc-c_ai-c">
                                                    <span className="liveBgColorSetting"></span>
                                                    <input type="color" value={this.state.bgSettingOne} onChange={this.settingBgSelectorOne.bind(this)} />
                                                    <input type="color" value={this.state.bgSettingTwo} onChange={this.settingBgSelectorTwo.bind(this)} />
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="settingRememberfld h6 mb-0"></span>
                                                </div>
                                                <div className="d-f_jc-c_ai-c">
                                                    <button className="btn btn-light btn- mt-2" id="settingRemember" onClick={()=>{this.localStorageSetGet("setLocal")}}>Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="settingModelmodelBgOverlay"></div>
                </div>

                <div className="board-container container p-0 shadow-lg rounded">
                    <Board color={this.state.brushColor} size={this.state.size} canvasbgclr={this.state.erasercolor} />
                </div>

                <div className="container footer">
                    <div className="shadow copyTxtCon" id="copyTxtCon">
                        <div className="text-danger">
                            <a href="https://github.com/lexuscreations/" className="td-n footerAnchor" target="_blank" rel="noopener noreferrer">
                                <p className="text-center fw-bolder m-0 d-f_jc-c_ai-c footerContentCon">
                                    <img src="images/logo.png" alt="Logo" className="fottorImg mr-2" />
                                    <span className="d-f_jc-c_ai-c">
                                        <span>colla</span>
                                        <span className="pt-1 footerCenterWord text-info">B</span>
                                        <span>oardPc</span>
                                        <span>&nbsp;-&nbsp;©By&nbsp;LexusCreations</span>
                                    </span>
                                </p>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Container