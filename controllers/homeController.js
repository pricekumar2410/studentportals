// Home Controller
// Handles requests for the home page

exports.getHome = (req, res) => {
    try {
        res.render('home/index', {
            title: 'Student Awards Portal',
        });
    } catch (error) {
        console.error('Error in getHome:', error);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};
