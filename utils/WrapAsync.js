module.exports = (fn) => {
    return function (req, res, next) { // <--- 'function' keyword lagaya
        fn(req, res, next).catch(next);
    };
}; 