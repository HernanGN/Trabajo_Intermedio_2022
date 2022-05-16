const { addNewAuth, getAuthByProv, getAuthByAffi, getAuthByDate, getAllAuth } = require("./authModel");

// 1 - Read All or Some Authorizations
const listAll = async(req, res, next) => {
    let dbResponse = null;
    if(req.query.idprestador) {
        dbResponse = await getAuthByProv(req.query.idprestador);
    } else { 
            if(req.query.nroafiliado) {
                dbResponse = await getAuthByAffi(req.query.nroafiliado);
            } else {
                if(req.query.fecha) {
                    dbResponse = await getAuthByDate(req.query.fecha);
                } else {
                    dbResponse = await getAllAuth();
                }
            }   
    }
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
};

// 2 - Add Authorization
const addOne = async(req, res, next) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();    
    // + Validation of Benefit and Affiliate, Is All Ok?
    const dbResponse = await addNewAuth({ nroafiliado:   req.body.nroafiliado,
                                          idprestador:   req.token.idprestador,
                                          codprestacion: req.body.codprestacion,
                                          fecha:         date,
                                          resultado:     true,
                                          observacion:   ''
                                        });
    dbResponse instanceof Error ? next(dbResponse) : res.status(201).json({message: `Autorización Ok ${req.token.usuario}`})
};

module.exports = { listAll, addOne }