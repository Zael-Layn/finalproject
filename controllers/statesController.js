const State = require('../model/States');

const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) {this.states = data}
};


async function setFacts(){
    for (const state in data.states){ 
        const fact = await State.findOne({statecode: data.states[state].code}).exec(); 
        if (fact){
            
            data.states[state].funfacts = fact.funfacts; 
        }
    }
}


setFacts();


const getAllStates = async (req,res)=> {
    
    if (req.query){
        if(req.query.contig == 'true')   
        {
            const result = data.states.filter(st => st.code != "AK" && st.code != "HI");
            res.json(result);
            return;
        }
        
        else if (req.query.contig == 'false') 
         {
            const result = data.states.filter( st => st.code == "AK" || st.code == "HI");     
            res.json(result);
            return;
         }
    }

   res.json(data.states); 
}


const getState = (req,res)=> {

    const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code);
    if(!state){ 
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json(state);
 }


 const getCapital = (req,res)=> {
    
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code);
    if(!state){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "capital": state.capital_city}); 
 }


 const getNickname = (req,res)=> {
     
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code); 
    if(!state){ 
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "nickname": state.nickname}); 
 }

 
 const getPopulation = (req,res)=> {
     
    const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code); 
    if(!state){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "population": state.population.toLocaleString("en-US")}); 
 }
 
 
 const getAdmission = (req,res)=> {

     
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code); 
    if(!state){
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    res.json({"state": state.state, "admitted": state.admission_date}); 
 }


 const getFunFact = (req,res)=>{
     
     const code = req.params.state.toUpperCase();

    const state = data.states.find( st => st.code == code);
    if(!state){ 
        return res.status(404).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(state.funfacts){ 
    
         res.status(201).json({"funfact": state.funfacts[Math.floor((Math.random()*state.funfacts.length))]}); 
    } 
    else
    {
        res.status(201).json({"message": `No Fun Facts found for ${state.state}`}); 
    }
}


const createFunFact = async (req,res)=>{
    if (!req?.params?.state){ 
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(!req?.body?.funfacts){

        return res.status(400).json({"message": "State fun facts value required"});
    }
    if(!Array.isArray(req.body.funfacts)) { 
        return res.status(400).json({'message': "State fun facts value must be an array"});
    }

     
     const code = req.params.state.toUpperCase();

    try {
         
       if(!await State.findOneAndUpdate({statecode: code},{$push: {"funfacts": req.body.funfacts}})){   
            await State.create({ 
                statecode: code,
                funfacts: req.body.funfacts
             });
        } 
        const result = await State.findOne({statecode: code}).exec();
     

        res.status(201).json(result); 
    } catch (err) {console.error(err);}   
    
    setFacts(); 
}

const updateFunFact = async (req,res)=>{
    if(!req?.params?.state){ 
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(!req?.body?.index) 
    {
        return res.status(400).json({"message": "State fun fact index value required"});
    }
    if(!req?.body?.funfact){

        return res.status(400).json({"message": "State fun fact value required"});
    }
   

     const code = req.params.state.toUpperCase();

    const state = await State.findOne({statecode: code}).exec(); 
    const jstate = data.states.find( st => st.code == code);

    let index = req.body.index; 

    if (!jstate.funfacts || index-1 == 0)
    {
        return res.status(400).json({"message": `No Fun Facts found for ${jstate.state}`});
    }
    
    if(index > state.funfacts.length || index < 1 || !index){ 
        const state = data.states.find( st => st.code == code);
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jstate.state}`});
    }
    index -= 1; 

    if (req.body.funfact) state.funfacts[index] = req.body.funfact; 
    
    const result = await state.save(); 

    res.status(201).json(result);

    setFacts(); 
}   

const deleteFunFact = async(req,res)=>{
    
    if(!req.params.state){ 
        return res.status(400).json({'message': 'Invalid state abbreviation parameter'});
    }
    if(!req.body.index) 
    {
        return res.status(400).json({"message": "State fun fact index value required"});
    }

     
    const code = req.params.state.toUpperCase();

    const state = await State.findOne({statecode: code}).exec(); 
    const jstate = data.states.find( st => st.code == code);

    let index = req.body.index; 

    if (!jstate.funfacts || index-1 == 0)
    {
        return res.status(400).json({"message": `No Fun Facts found for ${jstate.state}`});
    }
    
    if(index > state.funfacts.length || index < 1 || !index){ 
        const state = data.states.find( st => st.code == code);
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jstate.state}`});
    }
    index -= 1; 

    state.funfacts.splice(index, 1); 
    
    const result = await state.save(); 

    res.status(201).json(result);

    setFacts(); 
}

 module.exports={getAllStates, getState, getNickname, getPopulation, getCapital, getAdmission, getFunFact, createFunFact, updateFunFact,deleteFunFact};