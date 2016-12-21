package sample.extensions;

import com.ibm.ejs.container.*;

/**
 * EJSStatelessExtensionJDBCHelperHomeBean_35de5126
 */
public class EJSStatelessExtensionJDBCHelperHomeBean_35de5126 extends EJSHome {
	static final long serialVersionUID = 61;
	/**
	 * EJSStatelessExtensionJDBCHelperHomeBean_35de5126
	 */
	public EJSStatelessExtensionJDBCHelperHomeBean_35de5126() throws java.rmi.RemoteException {
		super();	}
	/**
	 * create
	 */
	public sample.extensions.ExtensionJDBCHelper create() throws javax.ejb.CreateException, java.rmi.RemoteException {
BeanO beanO = null;
sample.extensions.ExtensionJDBCHelper result = null;
boolean createFailed = false;
try {
	result = (sample.extensions.ExtensionJDBCHelper) super.createWrapper(null);
}
catch (javax.ejb.CreateException ex) {
	createFailed = true;
	throw ex;
} catch (java.rmi.RemoteException ex) {
	createFailed = true;
	throw ex;
} catch (Throwable ex) {
	createFailed = true;
	throw new CreateFailureException(ex);
} finally {
	if (createFailed) {
		super.createFailure(beanO);
	}
}
return result;	}
}
