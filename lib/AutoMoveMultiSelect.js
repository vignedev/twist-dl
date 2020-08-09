const { MultiSelect } = require('enquirer')

class AutoMoveMultiSelect extends MultiSelect{
    constructor(...options){
        super(...options)
    }
    space(){
        super.space()
        if(this.index != this.choices.length-1) super.down()
    }
}
module.exports = { AutoMoveMultiSelect }