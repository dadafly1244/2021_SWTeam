#include <GL/glew.h>
#include <GL/glut.h>
#include <stdlib.h>
#include <stdio.h>

void myinit(void) {
	printf("%s\n", glGetString(GL_VERSION));
}
void mykeyboard(unsigned char key, int x, int y) {
	switch (key) {
	case 27: // ESCAPE
		exit(0);
		break;
	}
}
void mydisplay(void) {
	glClearColor(1.0F, 0.5F, 0.5F, 1.0F);
	glClear(GL_COLOR_BUFFER_BIT);
	glFlush();
	glutSwapBuffers();
}
int main(int argc, char* argv[]) {
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
	glutInitWindowSize(500, 500);
	glutInitWindowPosition(0, 0);

	// replace ¡°simple¡± by your student number and name
	glutCreateWindow("2019113448_¼Û³ª¹Î");

	glutDisplayFunc(mydisplay);
	glutKeyboardFunc(mykeyboard);
	glewInit();
	myinit();
	glutMainLoop();
	return 0;
}