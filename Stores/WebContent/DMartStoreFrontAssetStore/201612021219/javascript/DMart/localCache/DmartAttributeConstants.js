
var DMartAttributes = {
    
    Constants : {
    	SizeAttributeConstants : ['WEIGHT','VOLUME','QUANTITY','FLAVOUR','SIZE', 'DIMENSIONS','HEIGHT' ],
    	
    	Grocery :{
				Defining : {
			    			Size :['WEIGHT_DAGROCERY','WEIGHT_DADAIRY & BEVERAGES','VOLUME_DAGROCERY','VOLUME_DADAIRY & BEVERAGES','QUANTITY_DAGROCERY','COLOUR_DAPACKAGED FOOD','FLAVOUR_DAGROCERY','COLOUR_DAGROCERY','WEIGHT_DAPACKAGED FOOD','QUANTITY_DADAIRY & BEVERAGES','FLAVOUR_DADAIRY & BEVERAGES','COLOUR_DADAIRY & BEVERAGES','VOLUME_DAPACKAGED FOOD','FLAVOUR_DAPACKAGED FOOD']
			    			 
							},
				Filters : {
							Brand : 'FILTER1_BRAND_GROCERY',
							Brands : ['FILTER1_BRAND_GROCERY','FILTER1_BRAND_DAIRY & BEVERAGES','FILTER1_BRAND_PACKAGED FOOD'],
							Type :'FILTER2_PRODUCT TYPE_GROCERY',
							Weight : 'FILTER3_WEIGHT_GROCERY',
							Volume : 'FILTER4_VOLUME_GROCERY',
							Flavour : 'FILTER5_FLAVOURS_GROCERY',
							Form : 'FILTER6_FORM_GROCERY',
							Grade : 'FILTER7_GRADE_GROCERY',
							PriceBand : 'FILTER8_PRICE BAND_GROCERY',
							ParentCatalogGroup : 'ParentCatalogGroup'
						  },
				Descriptive : {
								UnitPrice : 'PER 100 GM /ML',
								GrocerySegment : 'SEGMENT (PREMIUM)_GROCERY',
								GroceryForm : 'FORM ( TOOTH PASTE, SUGAR)_GROCERY',
								GroceryIngredients : 'INGREDIENTS_GROCERY',
								GroceryColour : 'COLOUR_GROCERY',
								GroceryFlavour :'FLAVOURS_GROCERY',
								GroceryAge : 'AGE_GROCERY GRADE_GROCERY',
								MilkType : 'MILK TYPE_GROCERY',
								GroceryPurity : '100% PURE_GROCERY',
								ImageDisplayCode : 'BINARY IMAGE CODE',
								ImageDisplayKey : 'IMAGE KEY',
								DeliveryFlag : 'HOME & PUP/ HOME / PUP',
								GiftWrapAvailabilityFlag : 'GIFT WRAP (Y/N)',
								CODFlag : 'COD (Y / N)',
								ExpressDeliveryFlag : 'EXPRESS DELIVERABLE (Y/N)',
								BulkyFlag : 'BULKY PRODUCT (Y/N)',
								FreightCharge : 'FREIGHT CHARGE(ITEM)',
								HighValueFlag : 'HIGH VALUE (Y/N)',
								FreebieProdDescription : 'DESCRIPTION INPUT',
								CategoryType : 'CATEGORY TEMPLATE TYPE',
								WhiteListFlag : 'WHITE LIST (Y/N)',
								MaxLimitOfTroley : 'ITEMWISE',
								VegNonVegIndicator : '1_Veg(green)_2_Non Veg(Red)_3_Egg(X Colour)_4_Other(Y Colour)',
								NutritionFacts : 'NUTRITIONAL FACTS',
								Cautions : 'cautions',
								Tnc : 'TNC'
							  }
    			},
    			Apparel : {
    				Defining:{
    					
    					Size : ['SIZE_DAAPPAREL','SIZE_APPAREL','LENGTH_DAAPPAREL','AGE GROUP_DAAPPAREL'],
						Colour : ['COLOUR_APPAREL','COLOUR_DAAPPAREL','Colour', 'COLOUR' ] 	    
							  },
							  
							  
							  
							  
							  

							  
    			    Filters : {
    			    			
    			    			Colour : 'FILTER2_COLOUR_APPAREL',
    							Size : 'FILTER3_SIZE_APPAREL',
    							
    							Fit : 'FILTER4_FIT_APPAREL',
    							
    							Type : 'FILTER1_PRODUCT TYPE_APPAREL',
    							count : 'FILTER5_COUNT_APPAREL',
    							ParentCatalogGroup : 'ParentCatalogGroup'
    			    		  },
    			   
    			   Descriptive : {
    				   			Design : 'DESIGN_APPAREL',
    				   			Embroidery : 'EMBROIDERY _APPAREL',
    				   			Fabric : 'FABRIC_APPAREL',
    				   			Fit : 'FIT_APPAREL',
    				   			Neck : 'NECK_APPAREL',
    				   			Collar : 'COLLARS_APPAREL',
    				   			Sleeve : 'SLEEVE_APPAREL',
    				   			Cuff : 'CUFFS_APPAREL',
    				   			Pockets : 'POCKETS _APPAREL',
    				   			Cut : 'CUT _APPAREL',
    				   			Length : 'LENGTH_APPAREL',
    				   			TrouserClosure : 'TROUSER CLOSURE _APPAREL',
    				   			BottomClosure : 'BOTTOM CLOSURE _APPAREL',
    				   			Strechable : 'STRECHABLE_APPAREL',
    				   			TopMaterialLength : 'TOP MATERIAL LENGTH_APPAREL',
    				   			BottomMaterialLength:'BOTTOM MATERIAL LENGTH_APPAREL',
    				   			DupattaMaterialLength: 'DUPATTA MATERIAL LENGTH_APPAREL',
    				   			ShirtMaterialLength: 'SHIRT MATERIAL LENGTH_APPAREL',
    				   			TrouserMaterialLength: 'TROUSER MATERIAL LENGTH_APPAREL',
    				   			PackegeContent : 'PACKAGE CONTENTS _APPAREL',
    				   			DryClean : 'DRY CLEAN_APPAREL',
    				   			Detergent : 'DETERGENTS_APPAREL',
    				   			DarkColour : 'DARK COLOURS_APPAREL',
    				   			Scrub : 'SCRUBBING_APPAREL',
    				   			WashingMedium : 'WASHING MEDIUM_APPAREL',
    				   			Wring : 'WRINNG_APPAREL',
    				   			Dry : 'DRY_APPAREL',
    				   			FreebieProdDescription : 'DESCRIPTION INPUT',
    				   			CategoryType : 'CATEGORY TEMPLATE TYPE',
    				   			Ironing : 'IRON_APPAREL',
    				   			Bleach : 'BLEACH_APPAREL',
    				   			}
    		},
    		HouseHold :{
    			Defining: {
    							Size : ['QUANTITY_DAAPPLIANCES','COLOUR_DAFOOTWEAR','DIMENSIONS_DABED & BATH','WEIGHT_DABED &amp; BATH','WEIGHT_DAFOOTWEAR','VOLUME_DAAPPLIANCES','SIZE_DAFOOTWEAR','LENGTH_DALUGGAGE & BAGS','COLOUR_DABED & BATH','WEIGHT_DABABY & KIDS_FMCG','VOLUME_DABABY & KIDS_FMCG','QUANTITY_DABABY & KIDS_FMCG','FLAVOUR_DABABY & KIDS_FMCG','WEIGHT_DABABY & KIDS_GM','VOLUME_DABABY & KIDS_GM','VOLUME_DAHOME & KITCHEN_HOUSEHOLD UTILITIES','VOLUME_DAHOME & KITCHEN_HOUSEHOLD UTILITIES_GM','SIZE_DAHOME & KITCHEN_HOUSEHOLD UTILITIES_GM','SIZE_DAHOME & KITCHEN_KITCHENWARE','VOLUME_DAPERSONAL CARE'],
    							
    							 
    					},
    			Filters : {
	 			    			Brand : 'FILTER1_BRAND_APPLIANCES',
	 			    			Brands : ['FILTER1_BRAND_APPLIANCES','FILTER1_BRAND_STATIONARY','FILTER1_BRAND_BED & BATH','FILTER1_BRAND_FURNITURE','FILTER1_BRAND_HOME & KITCHEN_HOUSEHOLD UTILITIES','FILTER1_BRAND_PERSONAL CARE','FILTER1_BRAND_FOOTWEAR','FILTER1_BRAND_BABY & KIDS_FMCG','FILTER1_BRAND_LUGGAGE & BAGS'],
	 			    			Colour : 'FILTER3_COLOURS_APPLIANCES',
	 							Type : 'FILTER6_PRODUCT TYPE_APPLIANCES',
	 							count : 'FILTER5_COUNT (PCS)_APPLIANCES',
	 							ParentCatalogGroup : 'ParentCatalogGroup'	
 			    		 },
 			   
    			Descriptive : {
				   			
				   			Warranty : 'WARRANTY_APPLIANCES',
				   			Pincode : 'PIN CODE_APPLIANCES',
				   			Region : 'REGION_APPLIANCES',
				   			Branch : 'BRANCH_APPLIANCES',
				   			State : 'STATE_APPLIANCES',
				   			District :'DISTRICT_APPLIANCES',
				   			City : 'CITY_APPLIANCES',
				   			Usp : 'USP_APPLIANCES',
				   			ButtonType : 'BUTTON TYPE_APPLIANCES',
				   			NoOfJar : 'NO OF JARS_APPLIANCES',
				   			Lid : 'LID LOCKING_APPLIANCES',
				   			Type : 'TYPE_APPLIANCES',
				   			Safety : 'SAFETY_APPLIANCES',
				   			EnergyRating : 'ENERGY RATING_APPLIANCES',
				   			Model : 'MODEL_APPLIANCES',
				   			BodyMaterial : 'BODY MATERIAL_APPLIANCES',
				   			HeatingElement : 'HEATING ELEMENT_APPLIANCES',
				   			MountType : 'MOUNT TYPE_APPLIANCES',
				   			ControlSetting : 'CONTROL SETTINGS_APPLIANCES',
				   			Motor : 'MOTOR_APPLIANCES',
				   			MaxPressure : 'MAX. RATED PRESSURE_APPLIANCES',
				   			Weight : 'WEIGHT_APPLIANCES',
				   			Power : 'POWER WATTS_APPLIANCES',
				   			Voltage : 'VOLTAGE_APPLIANCES',
				   			Colour : 'COLOUR_APPLIANCES',
				   			FreebieProdDescription : 'DESCRIPTION INPUT',
				   			
			   				
			   	}
    		}
	}
   
};