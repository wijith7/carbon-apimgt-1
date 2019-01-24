package org.wso2.carbon.apimgt.rest.api.publisher.dto;

import java.util.ArrayList;
import java.util.List;
import org.wso2.carbon.apimgt.rest.api.publisher.dto.ConversionPolicyInfoDTO;

import io.swagger.annotations.*;
import com.fasterxml.jackson.annotation.*;

import javax.validation.constraints.NotNull;





@ApiModel(description = "")
public class ConversionPolicyListDTO  {
  
  
  
  private List<ConversionPolicyInfoDTO> list = new ArrayList<ConversionPolicyInfoDTO>();
  
  
  private Integer count = null;

  
  /**
   **/
  @ApiModelProperty(value = "")
  @JsonProperty("list")
  public List<ConversionPolicyInfoDTO> getList() {
    return list;
  }
  public void setList(List<ConversionPolicyInfoDTO> list) {
    this.list = list;
  }

  
  /**
   * Number of policy resources returned.\n
   **/
  @ApiModelProperty(value = "Number of policy resources returned.\n")
  @JsonProperty("count")
  public Integer getCount() {
    return count;
  }
  public void setCount(Integer count) {
    this.count = count;
  }

  

  @Override
  public String toString()  {
    StringBuilder sb = new StringBuilder();
    sb.append("class ConversionPolicyListDTO {\n");
    
    sb.append("  list: ").append(list).append("\n");
    sb.append("  count: ").append(count).append("\n");
    sb.append("}\n");
    return sb.toString();
  }
}
