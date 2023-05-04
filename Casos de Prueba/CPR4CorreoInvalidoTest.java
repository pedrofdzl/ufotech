// Generated by Selenium IDE
import org.junit.Test;
import org.junit.Before;
import org.junit.After;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.core.IsNot.not;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Alert;
import org.openqa.selenium.Keys;
import java.util.*;
import java.net.MalformedURLException;
import java.net.URL;
public class CPR4CorreoInvalidoTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  JavascriptExecutor js;
  @Before
  public void setUp() {
    driver = new ChromeDriver();
    js = (JavascriptExecutor) driver;
    vars = new HashMap<String, Object>();
  }
  @After
  public void tearDown() {
    driver.quit();
  }
  @Test
  public void cPR4CorreoInvalido() {
    driver.get("https://heb-route.web.app/auth");
    driver.manage().window().setSize(new Dimension(390, 844));
    driver.findElement(By.cssSelector(".btn-secondary")).click();
    driver.findElement(By.id("nameField")).click();
    driver.findElement(By.id("nameField")).sendKeys("Juan");
    driver.findElement(By.id("lastnameField")).click();
    driver.findElement(By.id("lastnameField")).sendKeys("Hernández");
    driver.findElement(By.id("emailField")).click();
    driver.findElement(By.id("emailField")).sendKeys("juanhernandez2@hotmail");
    driver.findElement(By.id("passwordField")).click();
    driver.findElement(By.id("passwordField")).sendKeys("123456789");
    driver.findElement(By.id("repPasswordField")).click();
    driver.findElement(By.id("repPasswordField")).sendKeys("123456789");
    driver.findElement(By.cssSelector(".btn-primary")).click();
    assertThat(driver.switchTo().alert().getText(), is("El correo electrónico no es válido"));
  }
}
