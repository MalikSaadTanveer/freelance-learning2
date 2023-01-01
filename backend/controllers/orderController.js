const Gig = require("../models/gigModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const PremiumModal = require("../models/PremiumModal");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");



exports.createOrder = catchAsyncErrors(async (req, res, next) => {

    try {
        // req.body.user = req.user.id;
        const { price, description,userTo, gigId, status } = req.body;

        console.log(req.body)
        const order = new Order({ price, description,userTo, gigId,userFrom:req.user.id, status,createdAt:new Date() });
        
        console.log(order)
        await order.save()


        res.status(200).json({
            success: true,
            order
        })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});




exports.getBuyerOrders = catchAsyncErrors(async (req, res, next) => {

    try {
        
        const id = req.user.id
        // console.log(req.query)

        if(req.query.order && req.query.userTo && req.query.gigId){
            const order =  await Order.findById(req.query.order)
            const userTo =  await User.findById(req.query.userTo)
            const gigId =  await Gig.findById(req.query.gigId)

            if(order && userTo && gigId){
                return res.status(200).json({
                    success:true,
                    singleOrder:{
                        order,userTo,gigId
                    }
                })
                
            }
            else{
                return next(new ErrorHander("You have no order like that", 404));
                
            }
            
        }

        const seller = req.query.seller
        let q = 'userFrom'
        if(seller)
            q = 'userTo.id'

        
        
        const orders = await Order.find({[q]:id}).sort({createdAt:-1})
        
        res.status(200).json({
            success: true,
            orders
        })

    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});




exports.getOrdersChat = catchAsyncErrors(async (req, res, next) => {

    try {
            let orderId = req.query.orderId;
              
            let order = await Order.findById(orderId)
      
            res.status(200).json({
              success: true,
              chat: order.chatBetween
          })
    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});



exports.postOrdersChat = catchAsyncErrors(async (req, res, next) => {

    try {
      let orderId = req.query.orderId;
      let userId = req.query.userId;
      let text = req.query.text;
      let image = req.query.image;
      let name = req.query.name;
        
      await Order.findByIdAndUpdate(orderId,{$push: {"chatBetween": {userId,text,image,name}}})

      res.status(200).json({
        success: true,
    })


    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});



exports.orderAcceptByClient = catchAsyncErrors(async (req, res, next) => {

    try {
    
        let { sellerId ,projects,orderId} = req.body;
        let searchList = ['Python','Java','JavaScript','PHP','Ruby','Swift','Perl','SQL','Kotlin','Scala','Objective-C','Assemblylanguage','Rust','Fortran','MATLAB','COBOL','Ada','Haskell','Dart','VisualBasic','C++','c#','csharp','Lua','BASIC','Pascal','Prolog','Julia','Groovy','Erlang','HTML','ALGOL','APL','CSS','Elixir','Scriptinglanguage','CoffeeScript','Tcl','AppleScript','OCaml','ActionScript','VBScript','ECMAScript','AutoLISP','EmacsLisp','android','website','react','js','node','mongodb','express','mernstack','angular','vue','meanstack','jamstack','django','api','xml']
        
        let desc =  projects.desc.toLowerCase().replaceAll(" ",'')
        console.log(desc)

        let keywords = []

        searchList.forEach(word=>{
            if(desc.includes(word.toLowerCase())){
                if(word.toLowerCase() === 'c#')
                    keywords.push('csharp')
                if(word.toLowerCase() === 'javascript')
                    keywords.push('js')
                if(word.toLowerCase() === 'html')
                    keywords.push('html5')
                if(word.toLowerCase() === 'css')
                    keywords.push('css3')
    
                keywords.push(word.toLowerCase())
            }
        })

        const updatedData = await Order.findByIdAndUpdate(orderId, {status:'COMPLETE'}, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        const user = await PremiumModal.findOne({sellerId})

        if(user){
            console.log('we found')
            await PremiumModal.updateOne({sellerId},{$push: {"projects": {
                desc:projects.desc,
                keywords,
                gigId:projects.gigId,
            }}})

            return res.status(200).json({
                success: true,
            })
        }
        else{
            console.log("not found")
            const premium = new PremiumModal({sellerId,
            projects:[{
                desc:projects.desc,
                keywords,
                gigId:projects.gigId,
            }]
        })

            await premium.save()
            return res.status(200).json({
                success: true,
            })
        }



        console.log(keywords)

        res.status(200).json({
            success: true,
        })

    }
    catch (error) {
        return next(new ErrorHander(error.message, 500));
    }

});