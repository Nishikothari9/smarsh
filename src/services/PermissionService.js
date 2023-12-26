const BlogData = ['hr', 'admin', 'pm'];
const ProductRole = ['hr', 'admin', 'pdm']

class PermissionService {

    hasEditedAccess = (userRole) => {
        if(BlogData.includes(userRole)) {return true}
        else {return false}
        
    }

    hasProjectAccess = (userRole) => {
        if(ProductRole.includes(userRole)) return true
    }

    hasProjectClientAccess = (userRole) => {
        if(['hr', 'admin', 'pm', 'pdm'].includes(userRole)) return true;
    }

    hasProjectEditAccess = (userRole) => {
        if(['hr', 'admin'].includes(userRole)) return true;
    }

}

export default new PermissionService ()