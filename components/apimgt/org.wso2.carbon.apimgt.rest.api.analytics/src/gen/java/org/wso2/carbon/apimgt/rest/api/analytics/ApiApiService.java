package org.wso2.carbon.apimgt.rest.api.analytics;

import org.wso2.carbon.apimgt.rest.api.analytics.*;
import org.wso2.carbon.apimgt.rest.api.analytics.dto.*;

import org.wso2.msf4j.formparam.FormDataParam;
import org.wso2.msf4j.formparam.FileInfo;
import org.wso2.msf4j.Request;

import org.wso2.carbon.apimgt.rest.api.analytics.dto.APICountListDTO;
import org.wso2.carbon.apimgt.rest.api.analytics.dto.APIInfoListDTO;
import org.wso2.carbon.apimgt.rest.api.analytics.dto.APISubscriptionCountListDTO;

import java.util.List;
import org.wso2.carbon.apimgt.rest.api.analytics.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

public abstract class ApiApiService {
    public abstract Response apiCountOverTimeGet(String startTime
 ,String endTime
 ,String createdBy
  ,Request request) throws NotFoundException;
    public abstract Response apiListGet(String startTime
 ,String endTime
 ,String createdBy
  ,Request request) throws NotFoundException;
    public abstract Response apiSubscriberCountByApiGet(String startTime
 ,String endTime
 ,String apiId
  ,Request request) throws NotFoundException;
}
